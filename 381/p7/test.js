import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost",
    user: "api_user",
    password: "api_pass123",
    database: "capstone",
});

//const [view] = await pool.query("SELECT * FROM capstone_public");
//console.log(view);

//const [update] = await pool.query(
    //"CALL update_username(3, 'sample_user456');"
//);
//console.log(update);

await pool.query("SELECT * FROM users");
