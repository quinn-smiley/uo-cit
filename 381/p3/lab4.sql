-- Part 1: Aggregates and Grouping

SELECT COUNT(*) AS student_count
FROM students;

SELECT AVG(grade_points) AS avg_gpa
FROM enrollments
WHERE status = 'graded';

SELECT major,
COUNT(*) AS num_students
FROM students
GROUP BY major;

-- Part 2: HAVING and Sorting

SELECT s.major, 
ROUND(AVG(e.grade_points), 2) AS avg_grade
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
WHERE e.status = 'graded'
GROUP BY s.major
HAVING AVG(e.grade_points) > 3.2
ORDER BY avg_grade DESC;

SELECT s.course_id,
COUNT(e.enrollment_id) AS graded_count
FROM sections s
JOIN enrollments e ON s.section_id = e.section_id
WHERE e.status = 'graded'
GROUP BY s.course_id
ORDER BY graded_count DESC;

-- Part 3: Subqueries

SELECT student_id, first_name, last_name
FROM students
WHERE student_id IN (
    SELECT student_id
    FROM enrollments
);

SELECT DISTINCT s.student_id, s.first_name, s.last_name
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
WHERE e.grade_points >
      (SELECT AVG(grade_points) FROM enrollments)
ORDER BY s.last_name;

SELECT s.course_id,
AVG(e.grade_points) AS avg_grade
FROM sections s
JOIN enrollments e ON s.section_id = e. section_id
GROUP BY s.course_id
ORDER BY avg_grade DESC
LIMIT 1;

-- Part 4: Join & Aggregate Challenge

SELECT s.dept,
COUNT(DISTINCT s.student_id) AS num_students
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
WHERE e.status = 'graded'
GROUP BY s.dept;

SELECT s.student_id, s.first_name, s.last_name,
ROUND(AVG(e.grade_points), 2) AS avg_grade, 
COUNT(e.enrollment_id) AS graded_classes
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
WHERE e.status = 'graded'
GROUP BY s.student_id, s.first_name, s.last_name
ORDER BY avg_grade DESC, s.student_id DESC
LIMIT 3;
