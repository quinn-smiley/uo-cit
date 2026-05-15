CREATE TABLE users (
	user_id INT AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(50) NOT NULL,
    password_hash CHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL,
    game_title VARCHAR(100) NOT NULL
);

CREATE TABLE games (
	game_title VARCHAR(100) PRIMARY KEY, 
    genre VARCHAR(50) NULL,
    platform VARCHAR(50) NULL 
);

USE capstone
