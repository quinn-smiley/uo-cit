-- This creates a view that shows a student's id, first name, last name, and grade point average. This being from classes that have already been graded
-- CREATE OR REPLACE VIEW v_student_avg AS
-- SELECT s.student_id, s.first_name, s.last_name,
       -- ROUND(AVG(e.grade_points),2) AS avg_grade
-- FROM students s
-- JOIN enrollments e ON s.student_id = e.student_id
-- WHERE e.status = 'graded'
-- GROUP BY s.student_id;

-- This query selects the top 5 students by grade point average, from the previous view
-- SELECT student_id, first_name, last_name, avg_grade
-- FROM v_student_avg
-- ORDER BY avg_grade DESC
-- LIMIT 5;

-- This view excludes the grade point average column to hide it from the public view
-- CREATE OR REPLACE VIEW v_students_public AS
-- SELECT s.student_id, s.first_name, s.last_name
-- FROM students s
-- GROUP BY s.student_id;

-- Read only user
-- CREATE USER 'viewer'@'localhost' IDENTIFIED BY 'readonly123';
-- GRANT SELECT ON wk4_demo.v_students_public TO 'viewer'@'localhost';

-- Privilege testing:
-- SELECT * FROM wk4_demo.v_students_public; -> worked
-- SELECT * FROM wk4_demo.v_student_avg; -> failed
-- SELECT * FROM wk4_demo.students; -> failed

-- Stored procedure - course information by course id
-- DELIMITER //
-- CREATE PROCEDURE sp_list_courses()
-- BEGIN
  -- SELECT course_id, course_title, credits FROM courses ORDER BY course_id;
-- END //
-- DELIMITER ;

-- Test sp_list_courses
-- CALL sp_list_courses();

-- Stored procedure - update grade
-- DELIMITER //
-- CREATE PROCEDURE sp_update_grade(
  -- IN p_enroll_id INT,
  -- IN p_new_grade DECIMAL(3,2)
-- )
-- BEGIN
  -- UPDATE enrollments
  -- SET grade_points = p_new_grade
  -- WHERE enrollment_id = p_enroll_id;
-- END //
-- DELIMITER ;

-- Test sp_update_grade
-- SELECT * FROM enrollments;
-- CALL sp_update_grade(1, 3.95); -> failed for viewer

-- Grant procedures for viewer
-- GRANT EXECUTE ON wk4_demo.* TO 'viewer'@'localhost';

/* Everything worked as it should. My viewer was not able to update the enrollments table until I granted them the privilege to. However, the viewer was still unable to access the table enrollments to see the update they had just executed */

-- Reflection
/* I thought that views were pretty straight-forward. However, I see how they might get confusing. Like I mentioned in my previous comment I found it a bit surprising when my viewer could update a table but still not view the table to see the update. */



