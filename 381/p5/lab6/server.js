// npm install express dotenv mysql
// modern version using ES modules
// requires "type": "module" in package.json
import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from ./.env file
const app = express();
app.use(express.json());
const pool = mysql.createPool({
host: process.env.DB_HOST,
database: process.env.DB_NAME,
port: process.env.DB_PORT, // Database port, optional if using default 3306
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
connectionLimit: 10,
});


const port = 3000; 

//GET
app.get("/courses", (req, res) => {
    const sql = "SELECT * FROM courses";
    pool.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing query:", err.message);
            return res.status(500).json({ error: "Database query failed" });
        }
    res.json(results);
});
});



//POST
app.post("/courses", (req, res) => {
    const { course_id, course_title, credits } = req.body;

    if (!course_id || !course_title || credits === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (typeof course_id !== "string" || course_id.length > 10) {
        return res.status(400).json({ error: "course_id must be a string up to 10 characters" });
    }

    if (!Number.isInteger(credits)) {
        return res.status(400).json({ error: "credits must be an integer" });
    }

    const sql = `
        INSERT INTO courses (course_id, course_title, credits)
        VALUES (?, ?, ?)
    `;

    pool.query(sql, [course_id, course_title, credits], (err, results) => {

        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "Course ID already exists" });
            }
            return res.status(500).json({ error: "Database query failed", details: err.sqlMessage });
        }

        res.status(201).json({
            message: "Course created successfully",
            course_id: course_id
        });
    });

});



//PUT
app.put("/courses/:course_id", (req, res) => {
    const { course_id } = req.params
    const { course_title, credits } = req.body

    if (course_title === undefined && credits === undefined) {
        return res.status(400).json({ error: "Nothing to update" });
    }

    let fields = [];
    let values = [];

    if (course_title !== undefined) {
    fields.push("course_title = ?");
    values.push(course_title);
    }

    if (credits !== undefined) {
        fields.push("credits = ?");
        values.push(credits);
    }

    values.push(course_id);

    const sql = `UPDATE courses SET ${fields.join(", ")} WHERE course_id = ?`;


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



//DELETE
app.delete("/courses/:course_id", (req, res) => {
    const { course_id } = req.params


    const sql_sections = "SELECT * FROM sections WHERE course_id = ?"
    const sql_delete = "DELETE FROM courses WHERE course_id = ?"

    pool.query(sql_sections, [course_id], (err, sectionResults) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed", details: err.sqlMessage });
        }

        if (sectionResults.length > 0) {
            return res.status(400).json({ error: "Cannot delete course - it has sections" });
        }

        pool.query(sql_delete, [course_id], (err, deleteResult) => {
            if (err) {
                return res.status(500).json({ error: "Database query failed", details: err.sqlMessage });
            }

            if (deleteResult.affectedRows === 0) {
                return res.status(400).json({ error: "Course not found" });
            }

            res.json({ message: "Course deleted successfully", affectedRows: deleteResult.affectedRows });
        })

    });
});





app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});




// PRACTICE POST
// app.post("/enrollments", (req, res) => {

//     const { student_id, section_id, status, grade_points } = req.body;

//     if (!student_id || !section_id || !status || grade_points === undefined) {
//         return res.status(400).json({ error: "Missing required fields" });
//     }

//     const allowedStatuses = ["enrolled", "withdrawn", "graded"];
//     if (!allowedStatuses.includes(status)) {
//         return res.status(400).json({ error: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}` });
//     }


//     pool.query("SELECT * FROM sections WHERE section_id = ?", [section_id], (err, sectionResults) => {
//         if (err) return res.status(500).json({ error: "Database query failed" });
//         if (sectionResults.length === 0) return res.status(400).json({ error: "Section does not exist" });

//         // Insert enrollment
//         pool.query(
//             "INSERT INTO enrollments(student_id, section_id, status, grade_points) VALUES (?, ?, ?, ?)",
//             [student_id, section_id, status, grade_points],
//             (err, results) => {
//                 if (err){ 
//                     return res.status(500).json({ error: "Database query failed", details: err.sqlMessage });
//                 }
//                 res.json({ message: "Enrollment created successfully", enrollment_id: results.insertId });
//             }
//         );
//     });
// });