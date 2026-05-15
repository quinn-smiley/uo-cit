-- How many users got a specific result
SELECT r.result,
COUNT(u.username) AS user_count
FROM results r
JOIN users u ON r.user_id = u.user_id
WHERE r.result = 'Princess Mononoke';

-- Number of attempts per user
SELECT u.username,
COUNT(r.attempt_id) AS attempt_count
FROM users u 
JOIN results r ON u.user_id = r.user_id
GROUP BY u.username;

-- Users with a profile picture
SELECT u.username
FROM users u
WHERE u.profile_pic IS NOT NULL;