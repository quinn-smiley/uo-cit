DROP PROCEDURE IF EXISTS create_quiz_attempt;

DELIMITER $$

DROP PROCEDURE IF EXISTS create_quiz_attempt$$

CREATE PROCEDURE create_quiz_attempt(
    IN p_user_id INT,
    IN p_color VARCHAR(45),
    IN p_music VARCHAR(45),
    IN p_activity VARCHAR(45),
    OUT p_result VARCHAR(20),
    OUT p_attempt_id INT
)
BEGIN
    DECLARE final_result VARCHAR(20);

    -- Determine result logic
    IF (p_color IN ('Pink','Blue') AND p_music IN ('Pop','Indie'))
       OR (p_music IN ('Pop','Indie') AND p_activity IN ('Arts & Crafts','Shopping'))
       OR (p_color IN ('Pink','Blue') AND p_activity IN ('Arts & Crafts','Shopping'))
    THEN
        SET final_result = 'My Melody';
    ELSE
        SET final_result = 'Kuromi';
    END IF;

    -- Insert into responses table; attempt_id will auto-increment
    INSERT INTO responses (user_id, question_1_response, question_2_response, question_3_response)
    VALUES (p_user_id, p_color, p_music, p_activity);

    -- Capture the new attempt ID
    SET p_attempt_id = LAST_INSERT_ID();

    -- Return result
    SET p_result = final_result;
END$$

DELIMITER ;

