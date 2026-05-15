const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config();

const db = mysql.createPool({
  host: "localhost",
  user: "api_user",
  password: "USER_CONNECTION06",
  database: "capstone",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection()
  .then((conn) => {
    console.log("Database connection OK");
    conn.release();
  })
  .catch((err) => {
    console.error("Database connection FAILED:", err);
  });

const app = express();
const listenPort = 3000;
const listenIP = "127.0.0.1";

app.use(express.static("public"));
app.use(express.json({ limit: "10mb" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-dev-secret",
    resave: false,
    saveUninitialized: false,
  }),
);

const users = [];
const players = [];

// Sign Up
app.post("/signup", async (req, res) => {
  const { username, name, password, email, profile_pic } = req.body;

  // Validation
  if (!email || typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!username || typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({ error: "Username is required" });
  }

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  try {
    // Check if username or email already exists
    const [existingUsers] = await db.execute(
      "SELECT user_id FROM users WHERE username = ? OR email = ?",
      [username.trim(), email.trim().toLowerCase()],
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // Store password in plain text (no hashing)
    // Insert into database (MATCHES YOUR TABLE EXACTLY)
    const [result] = await db.execute(
      "INSERT INTO users (name, username, password, email, profile_pic) VALUES (?, ?, ?, ?, ?)",
      [
        name.trim(),
        username.trim(),
        password,
        email.trim().toLowerCase(),
        profile_pic || null,
      ],
    );

    const userId = result.insertId;

    // In-memory user object
    const newUser = {
      user_id: userId,
      name: name.trim(),
      username: username.trim(),
      password: password,
      email: email.trim().toLowerCase(),
      profile_pic: profile_pic || null,
    };

    users.push(newUser);

    // Set session
    req.session.username = newUser.username;
    req.session.name = newUser.name;
    req.session.user_id = userId;

    res.status(200).json({
      message: "Account created successfully",
      username: newUser.username,
      name: newUser.name,
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    res.status(500).json({ error: "Failed to create account" });
  }
});

// Sign In
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  if (!username || typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({ error: "Username is required" });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const [users] = await db.execute(
      "SELECT user_id, username, name, password, email, profile_pic FROM users WHERE username = ?",
      [username.trim()],
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = users[0];

    const isValidPassword = password === user.password;

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    req.session.username = user.username;
    req.session.name = user.name || user.username;
    req.session.user_id = user.user_id;

    res.status(200).json({
      message: "Signed in successfully",
      username: user.username,
      name: user.name || user.username,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Failed to sign in" });
  }
});

// Get user
app.get("/profile", async (req, res) => {
  const { user_id, username } = req.session;

  if (!user_id && !username) {
    return res
      .status(401)
      .json({ error: "Not authenticated. Please sign in." });
  }

  try {
    let user;

    if (user_id) {
      const [users] = await db.execute(
        "SELECT user_id, username, name, email, profile_pic FROM users WHERE user_id = ?",
        [user_id],
      );
      user = users[0];
    } else if (username) {
      const [users] = await db.execute(
        "SELECT user_id, username, name, email, profile_pic FROM users WHERE username = ?",
        [username],
      );
      user = users[0];
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      name: user.name || user.username,
      email: user.email,
      profile_pic: user.profile_pic || null,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

// Name
app.put("/profile/name", async (req, res) => {
  const { user_id } = req.session;
  const { new_name } = req.body;

  if (!user_id) {
    return res
      .status(401)
      .json({ error: "Not authenticated. Please sign in." });
  }

  if (!new_name || typeof new_name !== "string" || new_name.trim() === "") {
    return res
      .status(400)
      .json({ error: "New name is required and must be a non-empty string" });
  }

  const trimmedName = new_name.trim();

  try {
    const [result] = await db.execute(
      "UPDATE users SET name = ? WHERE user_id = ?",
      [trimmedName, user_id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    req.session.name = trimmedName;

    res.status(200).json({
      message: "Name updated successfully",
      name: trimmedName,
    });
  } catch (error) {
    console.error("Name update error:", error);
    res.status(500).json({ error: "Failed to update name" });
  }
});

const questions = [
  "What is your favorite color?",
  "What is your favorite type of music?",
  "What is your favorite activity?",
];
const colorAnswers = ["Pink", "Blue", "Black", "Purple"];
const musicAnswers = ["Rock", "Pop", "Indie", "R&B"];
const activityAnswers = ["Sports", "Arts & Crafts", "Making music", "Shopping"];

app.get("/get-questions", (req, res) => {
  if (!colorAnswers || !musicAnswers || !activityAnswers || !questions) {
    return res.status(400).json({ error: "All questions must be answered" });
  } else {
    res.status(200).json({
      question1: questions[0],
      options1: colorAnswers,
      question2: questions[1],
      options2: musicAnswers,
      question3: questions[2],
      options3: activityAnswers,
    });
  }
});

// Responses
app.post("/responses", async (req, res) => {
  const { user_id } = req.session;
  let { colorResponse, musicResponse, activityResponse } = req.body;

  if (!user_id) {
    return res.status(401).json({ error: "User must be signed in" });
  }

  if (!colorResponse || !colorAnswers.includes(colorResponse)) {
    return res.status(400).json({ error: "Invalid answer for question #1" });
  }

  if (!musicResponse || !musicAnswers.includes(musicResponse)) {
    return res.status(400).json({ error: "Invalid answer for question #2" });
  }

  if (!activityResponse || !activityAnswers.includes(activityResponse)) {
    return res.status(400).json({ error: "Invalid answer for question #3" });
  }

  req.session.colorResponse = colorResponse;
  req.session.musicResponse = musicResponse;
  req.session.activityResponse = activityResponse;

  try {
    await db.query(
      `CALL create_quiz_attempt(?, ?, ?, ?, @p_result, @p_attempt_id)`,
      [user_id, colorResponse, musicResponse, activityResponse],
    );

    const [[output]] = await db.query(`SELECT @p_attempt_id AS attemptId`);
    const attemptId = output.attemptId;

    req.session.attempt_id = attemptId;

    res.status(200).json({
      message: "Responses saved successfully",
      attemptId,
      responses: {
        color: colorResponse,
        music: musicResponse,
        activity: activityResponse,
      },
    });
  } catch (error) {
    console.error("Error saving responses:", error);
    res.status(500).json({ error: "Failed to save responses" });
  }
});

// Get result
app.get("/get-result", async (req, res) => {
  const { user_id, attempt_id } = req.session;

  if (!user_id || !attempt_id) {
    return res
      .status(400)
      .json({ error: "No quiz attempt found. Please submit responses first." });
  }

  try {
    const [[attempt]] = await db.query(
      `SELECT question_1_response AS color, question_2_response AS music, question_3_response AS activity 
             FROM responses WHERE attempt_id = ? AND user_id = ?`,
      [attempt_id, user_id],
    );

    if (!attempt) {
      return res
        .status(404)
        .json({ error: "Attempt not found for this user." });
    }

    let quizResult;
    const { color, music, activity } = attempt;

    if (
      (["Pink", "Blue"].includes(color) && ["Pop", "Indie"].includes(music)) ||
      (["Pop", "Indie"].includes(music) &&
        ["Arts & Crafts", "Shopping"].includes(activity)) ||
      (["Pink", "Blue"].includes(color) &&
        ["Arts & Crafts", "Shopping"].includes(activity))
    ) {
      quizResult = "My Melody";
    } else {
      quizResult = "Kuromi";
    }

    req.session.quizResult = quizResult;

    res.status(200).json({
      message: `You are ${quizResult}!`,
      result: quizResult,
    });
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({ error: "Failed to fetch result" });
  }
});

// Reset
app.delete("/reset", (req, res) => {
  delete req.session.colorResponse;
  delete req.session.musicResponse;
  delete req.session.activityResponse;
  delete req.session.attempt_id;
  delete req.session.quizResult;

  res.status(200).json({ message: "Responses have been reset" });
});

// Backend routes
app.get("/user-attempts", async (req, res) => {
  const { user_id } = req.session;

  if (!user_id) return res.status(401).json({ error: "Not authenticated" });

  try {
    const [rows] = await db.execute(
      `
            SELECT 
                r.attempt_id,
                r.question_1_response,
                r.question_2_response,
                r.question_3_response,
                r.created_at AS response_time,
                res.result,
                res.time_submitted AS result_time
            FROM responses r
            JOIN results res ON r.attempt_id = res.attempt_id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `,
      [user_id],
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching user attempts:", error);
    res.status(500).json({ error: "Failed to fetch user attempts" });
  }
});

app.get("/view-stats", async (req, res) => {
  try {
    const [[stats]] = await db.query("SELECT * FROM quiz_stats");
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching quiz stats:", error);
    res.status(500).json({ error: "Failed to fetch quiz stats" });
  }
});

app.use((req, res) => {
  const response = {
    error: "Route not found",
    statusCode: 404,
  };
  res.status(404).send(response);
});

app.listen(listenPort, listenIP, () => {
  console.log(`Server is running on http://${listenIP}:${listenPort}`);
});
