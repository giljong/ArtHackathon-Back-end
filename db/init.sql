DROP DATABASE IF EXISTS ;

CREATE DATABASE Art;
USE Art;

CREATE TABLE Users(
    ID VARCHAR(100) NOT NULL,
    PW VARCHAR(100) NOT NULL,
    EMAIL VARCHAR(100) NOT NULL PRIMARY KEY,
    SCORE INT DEFAULT 0,
    CNT INT
);


