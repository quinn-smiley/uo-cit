CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) NOT NULL, 
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    profile_pic VARCHAR(100) NULL
);

CREATE TABLE results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id INT NOT NULL, 
    result VARCHAR(20) NOT NULL,
    time_submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE responses (
    attempt_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_1_response INT NOT NULL,
    question_2_response INT NOT NULL,
    question_3_response INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);
