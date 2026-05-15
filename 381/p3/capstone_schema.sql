-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema capstone_quiz
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema capstone_quiz
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `capstone_quiz` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `capstone_quiz` ;

-- -----------------------------------------------------
-- Table `capstone_quiz`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capstone_quiz`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(100) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `profile_pic` VARCHAR(150) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `capstone_quiz`.`results`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `capstone_quiz`.`results` (
  `attempt_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `result` VARCHAR(50) NOT NULL,
  `time_submitted` TIMESTAMP NOT NULL,
  PRIMARY KEY (`attempt_id`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `capstone_quiz`.`users` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
