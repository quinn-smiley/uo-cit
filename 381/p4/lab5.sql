-- Part 1: 

SELECT * FROM students;

INSERT INTO students (student_id, first_name, last_name, major, dept, phone, created_at)
VALUES
(109, 'Nora', 'Trejada', 'Journalism', 'SOJC', '(000)-000-0001', NOW()),
(102, 'Ruby', 'Anderson', 'Business Administration', 'Business', '(000)-000-0111', NOW());
-- (103, 'Sadie', NULL, 'Public Relations', 'SOJC', '(000)-000-0011', NOW());
-- Error: Column 'last_name' cannot be NULL because it is defined as NOT NULL.

SELECT * FROM students;

SELECT * FROM enrollments;

INSERT INTO enrollments (enrollment_id, student_id, section_id, status, grade_points, enrolled_at)
VALUES
('01', 101, '01', 'graded', 3.25, NOW()),
('02', 102, '01', 'graded', NULL, NOW());

SELECT * FROM enrollments;

SELECT * FROM sections;

INSERT INTO sections (section_id, course_id, semester, year)
VALUES ('10', 'CIS110', 'Fall', 2025);

SELECT * FROM sections;


-- Part 2: Update

SELECT * FROM students WHERE major = 'Journalism';
UPDATE students SET dept = 'Writing' WHERE major = 'Journalism';
SELECT * FROM students WHERE major = 'Journalism';

SELECT * FROM enrollments WHERE grade_points = 3.0;
UPDATE enrollments SET grade_points = 3.2 WHERE grade_points = 3.0;
SELECT * FROM enrollments WHERE grade_points = 3.2;

-- Part 3: Delete

SELECT * FROM enrollments WHERE status = 'graded';
DELETE FROM enrollments WHERE status = 'graded';
SELECT * FROM enrollments WHERE status = 'graded';

-- Part 4: Transaction

START TRANSACTION;
SELECT * FROM enrollments WHERE grade_points = 3.75;
UPDATE enrollments SET status = 'graded' WHERE grade_points = 3.75;
SELECT * FROM enrollments WHERE grade_points = 3.75;
COMMIT;