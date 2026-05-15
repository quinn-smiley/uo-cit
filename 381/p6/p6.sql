/* Improving Queries - Project 6 */

/* Queries */
/*EXPLAIN
SELECT r.result,
COUNT(u.username) AS user_count
FROM results r
JOIN users u ON r.user_id = u.user_id
WHERE r.result = 'Princess Mononoke';

CREATE INDEX idx_results_result ON results(result);

CREATE INDEX idx_results_user_id ON results(user_id);*/

/*EXPLAIN
SELECT u.username,
COUNT(r.attempt_id) AS attempt_count
FROM users u 
JOIN results r ON u.user_id = r.user_id
GROUP BY u.username;

CREATE INDEX idx_users_username ON users(username);*/

EXPLAIN
SELECT u.username
FROM users u
WHERE u.profile_pic IS NOT NULL;

/*CREATE INDEX idx_users_profile_pic_username ON users(profile_pic, username);*/






