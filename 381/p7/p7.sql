-- Create API user
-- CREATE USER 'api_user'@'%' IDENTIFIED BY 'api_pass123';

-- Public View
-- CREATE OR REPLACE VIEW capstone_public AS
-- SELECT username, profile_pic
-- FROM users
-- WHERE profile_pic IS NOT NULL;

-- Test view
-- SELECT * FROM capstone_public;

-- Grant privileges 
-- GRANT SELECT ON capstone.capstone_public TO 'api_user'@'%';

-- Result of privileges:
-- SELECT * FROM capstone.capstone_public; -> worked
-- SELECT * FROM capstone.users; -> failed

-- Stored procedure - update username

-- DELIMITER //
-- CREATE PROCEDURE update_username(
	-- IN p_user_id INT,	
	-- IN p_new_username VARCHAR(50)
-- )
-- BEGIN
	-- UPDATE users
    -- SET username = p_new_username
    -- WHERE user_id = p_user_id;
    
    -- SELECT * FROM users WHERE user_id = p_user_id;
-- END //
-- DELIMITER ;

-- Update privileges
-- GRANT EXECUTE ON PROCEDURE capstone.update_username TO 'api_user'@'%';

-- Test stored procedure
-- CALL capstone.update_username(1, 'sample_user123'); -> worked
-- UPDATE your_schema.capstone_projects SET status = 'Test' WHERE id = 3; -> failed

