SELECT * FROM users;
SELECT * FROM results;

INSERT INTO users (user_id, username, password_hash, email, profile_pic)
VALUES (7, 'alexjones', 'hashed_pw_123', 'alex@example.com', 'alex_pic.png');

INSERT INTO users (user_id, username, password_hash, email, profile_pic)
VALUES 
    (4, 'marias', 'hashed_pw_456', 'maria@example.com', 'maria_pic.png'),
    (5, 'liwang', 'hashed_pw_789', 'li@example.com', 'li_pic.png');

INSERT INTO results (attempt_id, user_id, result, time_submitted)
VALUES (4, 1, 85, '2025-11-01 10:00:00');

SELECT * FROM users;
SELECT * FROM results;