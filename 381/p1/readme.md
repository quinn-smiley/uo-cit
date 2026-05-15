Quinn Smiley   
CIT 381  
October 9, 2025

**Summary**  
	I wanted to create two tables that kept track of users and the games they played. Since I want to go into videogame development, I figured this was an oversimplified way for me to understand how gaming companies keep track of users. Additionally, this will help me build my database for the Capstone Project because I am creating a buzzfeed-style quiz and I want to keep track of the users who take the quiz and the results they get. 

**Table Dictionary**

users Table

* user\_id \- INT, AI, PK, NOT NULL  
* username \- VARCHAR(50), NOT NULL  
* password\_hash \- CHAR(60), NOT NULL  
* email \- VARCHAR(100), NOT NULL  
* game\_title VARCHAR(100), NOT NULL

All of this information is needed for a user to have an account. 

games Table

* game\_title \- VARCHAR(100), NOT NULL  
* genre \- VARCHAR(50), NULL  
* platform \- VARCHAR(50), NULL

The genre and platform the games are on is not crucial to the account or the title. 

**AI Prompt**  
Propose two MySQL tables for a gaming (games and users) dataset. Include a primary key for each table, realistic column names, MySQL data types, and which columns should allow NULL. Do not include foreign keys yet. Explain each choice in one short phrase.

**AI Response** 

### **1\. `users` Table**

`CREATE TABLE users (`  
    `user_id INT AUTO_INCREMENT PRIMARY KEY,     -- Unique user identifier`  
    `username VARCHAR(50) NOT NULL,              -- Chosen username, required`  
    `email VARCHAR(100) NOT NULL,                -- User's email, required`  
    `password_hash CHAR(60) NOT NULL,            -- Hashed password, required`  
    `date_joined DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- When user joined`  
    `last_login DATETIME NULL,                   -- Last login time, optional`  
    `country VARCHAR(50) NULL                    -- User's country, optional`  
`);`

### **Explanation:**

* `user_id`: Unique identifier for each user.

* `username`: Mandatory display name.

* `email`: Required for login/contact.

* `password_hash`: Security measure, store hashed password.

* `date_joined`: When account was created.

* `last_login`: Nullable to allow for inactive users.

* `country`: Optional user demographic info.

---

### **2\. `games` Table**

`CREATE TABLE games (`  
    `game_id INT AUTO_INCREMENT PRIMARY KEY,     -- Unique game identifier`  
    `title VARCHAR(100) NOT NULL,                -- Name of the game, required`  
    `genre VARCHAR(50) NOT NULL,                 -- Game genre (e.g., Action, RPG)`  
    `release_date DATE NULL,                     -- Optional release date`  
    `platform VARCHAR(50) NOT NULL,              -- Platform (e.g., PC, Xbox)`  
    `developer VARCHAR(100) NULL                 -- Game developer, optional`  
`);`

### **Explanation:**

* `game_id`: Unique identifier for each game.

* `title`: Required game name.

* `genre`: Required for categorization.

* `release_date`: Nullable for unreleased/unknown games.

* `platform`: Required to know where game runs.

* `developer`: Optional metadata about the creator.

**Changes**

	I chose not to include any of the location or time-based columns in either table like “country” or “release-date.” The data I am trying to capture is how many users play which game on which console, so I didn’t think that these columns were relevant. 

**Capstone Connection**

	I feel like this has really helped me understand how I will structure my database in my Capstone Project. Especially because I am planning to create a buzzfeed quiz, so the users table will be a great way to store information about the people who take my quiz. Additionally, the games table will be replaced by a results table that logs all the results of every attempt at my quiz. I understand the concept of foreign keys very well, however, I feel that I still struggle to implement them in MySQL Workbench. I will continue to try to implement foreign keys as it will be essential to my Capstone Project. 