USE capstone;

-- Step 1: Create a temporary table with the new structure
CREATE TABLE IF NOT EXISTS responses_new (
    attempt_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_1_response INT NOT NULL,
    question_2_response INT NOT NULL,
    question_3_response INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 2: Migrate existing data from old structure to new structure
-- This groups by attempt_id and pivots the question_num rows into columns
INSERT INTO responses_new (user_id, question_1_response, question_2_response, question_3_response)
SELECT 
    r1.user_id,
    MAX(CASE WHEN r1.question_num = 1 THEN r1.option_selected END) as question_1_response,
    MAX(CASE WHEN r1.question_num = 2 THEN r1.option_selected END) as question_2_response,
    MAX(CASE WHEN r1.question_num = 3 THEN r1.option_selected END) as question_3_response
FROM responses r1
GROUP BY r1.attempt_id, r1.user_id
HAVING question_1_response IS NOT NULL 
   AND question_2_response IS NOT NULL 
   AND question_3_response IS NOT NULL;

-- Step 3: Drop the old table
DROP TABLE IF EXISTS responses;

-- Step 4: Rename the new table to the original name
RENAME TABLE responses_new TO responses;

-- Verify the new structure
DESCRIBE responses;