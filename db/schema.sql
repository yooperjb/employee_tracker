DROP DATABASE IF EXISTS company;
CREATE DATABASE company;
USE company;

CREATE TABLE departments(
    id INT(4) AUTO_INCREMENT NOT NULL,
    deptName VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE roles(
    id INT(4) AUTO_INCREMENT NOT NULL,
    jobTitle VARCHAR(30),
    dept_id INT(4),
    salary DECIMAL(6),
    PRIMARY KEY (id),
    --CONSTRAINT fk_dept FOREIGN KEY(dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE employees(
    id INT(4) AUTO_INCREMENT NOT NULL,
    fName VARCHAR(20),
    lName VARCHAR(20),
    role_id INT(4),
    manager_id INT(4),
    PRIMARY KEY (id)
);