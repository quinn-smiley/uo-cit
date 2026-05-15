SELECT r.*
FROM results r
LEFT JOIN responses s ON r.attempt_id = s.attempt_id
WHERE s.attempt_id IS NULL;

SET SQL_SAFE_UPDATES = 1;
