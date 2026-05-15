SHOW INDEXES FROM students;
/* 	Primary key: student_id
	Foreign created indexes? No
    Additional indexes: dept, major*/
SHOW INDEXES FROM enrollments;
/*  Primary key: enrollment_id
	Foreign created indexs? Yes - student_id and section_id
    Additional indexes: uq_student_section, uq_student_section, idx_enr_student, idx_enr_section*/

/*EXPLAIN SELECT * 
FROM enrollments 
WHERE status = 'graded' 
ORDER BY student_id;

CREATE INDEX idx_enrollments_status_student 
ON enrollments(status, student_id);

DROP INDEX idx_enrollments_status_student ON enrollments;*/

/*EXPLAIN 
SELECT s.student_id, s.first_name, s.last_name, e.grade_points
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
WHERE e.status = 'graded';

CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);

DROP INDEX idx_enrollments_student_id ON enrollments;*/

/*EXPLAIN
SELECT * FROM courses
WHERE LOWER(course_title) LIKE '%api%';

CREATE FULLTEXT INDEX idx_ft_courses_title ON courses(course_title);
SELECT * FROM courses WHERE MATCH(course_title) AGAINST('api');*/

DROP INDEX idx_ft_courses_title ON courses;


/* Pros and cons of using a full text index
   Pros:
	- efficient text searching
    - relevance ranking
    - built-in functionality
    - supports natura language search
    - boolean search options
    - good for samll to medium data sets
   Cons: 
	- limited column types 
    - storage engine restrictions
    - performance issues on large datasets
    - language limitations
    - index maintainence overhead
    - not as feature-rich as alternatives
    
    *Researched with the help of Microsoft Copilot*/
    