const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'omvqzSOnzUjvjZRF5IOE',
    database: 'company'
});

connection.connect(err => {
    if (err) throw err;
    //console.log('Connected as id ' + connection.threadId);
    startMenu();
});

const startMenu = () => {
    console.log(`
    ╔===========╗
    ║  EMPLOYEE ║
    ║  MANAGER  ║
    ╚===========╝
    `);
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'task',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'End'
                ]
            }
        ]).then(startTask => {
            //console.log(startTask.task);
            const task = startTask.task;
            switch(task) {
                case 'View all departments':
                    viewDept();
                    break;
                
                case 'View all roles':
                    viewRoles();
                    break;

                case 'View all employees':
                    viewEmp();
                    break;

                case 'Add a department':
                    addDept();
                    break;

                case 'Add a role':
                    addRole();
                    break;

                case 'Add an employee':
                    addEmp();
                    break;

                case 'Update an employee role':
                    updateEmp();
                    break;
                
                case 'End':
                    end();
                    break;
            }
        })
};

// View all departments
const viewDept = () => {
    connection.query('SELECT * FROM departments',
    function(err, results, fields) {
        //console.log("Results: ",results);
        console.table(results);
        //console.log("Fields: ",fields);
    })
    startMenu();
};

const viewRoles = () => {
    connection.query('SELECT * FROM roles',
    function(err, results, fields) {
        console.table(results , '\n');
    })
    startMenu();
};

const end = () => {
    console.log('Thank You');
    connection.end();
}

// Initialize startMenu
// startMenu();