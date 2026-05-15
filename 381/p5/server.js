import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config(); 
const app = express();
app.use(express.json());
const pool = mysql.createPool({
host: process.env.DB_HOST,
database: process.env.DB_NAME,
port: process.env.DB_PORT,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
connectionLimit: 10,
});


const port = 3001; 

//GET USERS
app.get("/users", (req, res) => {
    const sql = "SELECT * FROM users";
    pool.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err.message);
            return res.status(500).json({ error: "Database query failed" });
        }
    res.json(results);
});
});

//GET user
app.get("/user", (req, res) => {
    const sql = "SELECT * FROM users WHERE user_id = 3";
    pool.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err.message);
            return res.status(500).json({ error: "Database query failed" });
        }
    res.json(results);
});
});

//POST user
app.post("/addUser", (req, res) => {
    const { user_id, username, password_hash, email } = req.body;

    if (!user_id || !username || !password_hash || email === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `
        INSERT INTO users (user_id, username, password_hash, email)
        VALUES (?, ?, ?, ?)
    `;

    pool.query(sql, [user_id, username, password_hash, email], (err, results) => {

        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "User already exists" });
            }
            return res.status(500).json({ error: "Database query failed", details: err.sqlMessage });
        }

        res.status(201).json({
            message: "User created successfully",
            user_id : user_id
        });
    });

});

//PUT user
app.put("/users/:user_id", (req, res) => {
    const { user_id } = req.params
    const { username, password_hash, email } = req.body

    if (username === undefined && password_hash === undefined && email === undefined) {
        return res.status(400).json({ error: "Nothing to update" });
    }

    let fields = [];
    let values = [];

    if (username !== undefined) {
    fields.push("username = ?");
    values.push(username);
    }

    if (password_hash !== undefined) {
        fields.push("password_hash = ?");
        values.push(password_hash);
    }

    if (email !== undefined) {
        fields.push("email = ?");
        values.push(email);
    }

    values.push(user_id);

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE user_id = ?`;


    pool.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed", details: err.sqlMessage});
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "No rows updated"})
        }

        res.json({
            message: "Updated row successfully",
            affectedRows: result.affectedRows
        })
    })
});


// app.get("/results", (req, res) => {
//     const sql = "SELECT * FROM results";
//     pool.query(sql, (err, results) => {
//         if (err) {
//             console.error("Error executing query:", err.message);
//             return res.status(500).json({ error: "Database query failed" });
//         }
//     res.json(results);
// });
// });


//DELETE result
app.delete("/results/:attempt_id", (req, res) => {
     const attempt_id = parseInt(req.params.attempt_id, 10);

     const sql_delete = "DELETE FROM results WHERE attempt_id = ?"

     pool.query(sql_delete, [attempt_id], (err, deleteResult) => {
         if (err) {
             return res.status(500).json({ error: "Database query failed", details: err.sqlMessage });
         }

         if (deleteResult.affectedRows === 0) {
             return res.status(400).json({ error: "Attempt not found" });
         }

         res.json({ message: "Attempt deleted successfully", affectedRows: deleteResult.affectedRows });
     })

 });










app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});