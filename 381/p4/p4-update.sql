SELECT * FROM users WHERE user_id = 2;

UPDATE users
SET email = 'maria.santos@example.com'
WHERE user_id = 2;

SELECT * FROM users WHERE user_id = 2;

SELECT * FROM results;

UPDATE results
SET result = result + 5
WHERE result < 90;

SELECT * FROM results;