SELECT * FROM capstone_quiz.users;

INSERT INTO users (user_id, username, password_hash, email, profile_pic) VALUES
(001, 'q.smiley', 'vjeka567', 'qsmiley@gmail,com', 'prof_pic.jpeg'),
(002, 'g.sykes', 'hbeie8980', 'gsykes@gmail.com', 'pic_04.jpeg'),
(003, 's.morita', 'gnrjkb7564', 'smorita@gmail.com', 'my_pic.jpeg')

SELECT * FROM capstone_quiz.results;

INSERT INTO results (attempt_id, user_id, result, time_submitted) VALUES
(0001, 001, 'Princess Mononoke', '2025-10-26 14:37:52'),
(0002, 002, 'Chihiro', '2025-10-26 14:38:02'),
(0003, 003, 'Ponyo', '2025-10-26 14:39:36')