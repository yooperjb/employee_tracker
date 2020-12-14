# Employee Tracker
![Note Taker](https://img.shields.io/github/languages/top/yooperjb/note_taker) ![MIT](https://img.shields.io/badge/license-MIT-blue)

## Description
Employee Tracker is a Node.js application using a MySQL database to store employee information. It emulates a typical company application that allows viewing, storing, and editing employee information through a command line interface (CLI). 

![Screenshot](/assets/images/screenshot.jpg)

The application has the following features:
* View all departments
* View all job roles
* View all employees
* View all employees by department
* View all employees by manager
* Add an employee
* Add a department
* Add a job roles
* Edit an employee role
* Edit an employee manager

## Table of Contents
* [Installation Requirements](#install)
* [NPM Packages](#npm)
* [Application Usage](#usage)
* [Tests](#tests)
* [Questions](#questions)

## Preview
A sample video showing the application in action can be viewed [here](https://drive.google.com/file/d/1jqQ-xLuEQvhYFPpIEQPE7vunSh29e-pN/view?usp=sharing). The project repository can be found on [github](https://github.com/yooperjb/employee_tracker). 

## <a name=install></a>Installation Requirements
Employee Tracker requires [node.js](https://nodejs.org/en/) which must be installed prior to using the application. There are also package dependecies rquired which can be installed using:

```
npm install
```
The application uses [MySQL](https://dev.mysql.com/downloads/) database which must also be installed to use. There are schema.sql and seed.sql files that can be used to build and populate a sample working company employee database. 

### <a name=npm></a>NPM Packages
* Inquirer - CLI libraray
* MySQL - Database Engine
* mysql2 - MySQL Node.js client
* asciiart-logo - Splash screen renderer
* console.table - Table styling library

***

## <a name=usage></a>Application Usage
The application can be cloned from gihub using:
```
git clone https://github.com/yooperjb/employee_tracker.git
```
Once all of the dependencies are installed, the database can be built and seeded using the following commands in the mysql CLI:
```
source db schema.sql
source db seeds.sql
```
To run the application, from root use:
```
npm start
```

## Tests
No tests were completed yet for this application. 

## Questions
Any questions or feedback regarding this project can be sent directly to my [email](mailto:jason.barnes@humboldt.edu). This project and others can be found at my [Github page]('https://github.com/yooperjb').