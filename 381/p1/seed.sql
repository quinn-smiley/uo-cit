INSERT INTO users (user_id, username, password_hash, email, game_title)
VALUES 
(01, 'exampl_1', 'hashexample01', 'example@gmail.com', 'Minecraft'),
(02, 'exampl_2', 'hashexample02', 'example@yahoo.com', 'Minecraft'),
(03, 'exampl_3', 'hashexample03', 'example_3@gmail.com', 'Sims 4');

INSERT INTO games (game_title, genre, platform)
VALUES
('Minecraft', 'Action-Adventure', 'Cross-platform'),
('Sims 4', 'Simulation', 'Cross-platform'),
('Stardew Valley', 'Simulation', 'Cross-platform');