const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Variables
let departmentsArray = [];


// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'omvqzSOnzUjvjZRF5IOE',
    database: 'company'
});

// Connect to db and start CLI
connection.connect(err => {
    if (err) throw err;
    console.log('Connected as id ' + connection.threadId);
    startMenu();
});

console.log(`
╔===========╗
║  EMPLOYEE ║
║  MANAGER  ║
╚===========╝
`);

const startMenu = () => {

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'task',
                message: 'What would you like to do?',
                choices: [
                    'View ALL Departments',
                    'View ALL Roles',
                    'View ALL Employees',
                    new inquirer.Separator(),
                    'Add Department',
                    'Add Role',
                    'Add Employee',
                    new inquirer.Separator(),
                    'Update Employee Role',
                    'End Application'
                ],
            }
        ]).then(startTask => {
            //console.log(startTask.task);
            // Function to call based on option chosen
            switch(startTask.task) {
                case 'View ALL Departments':
                    viewDept();
                    break;
                
                case 'View ALL Roles':
                    viewRoles();
                    break;

                case 'View ALL Employees':
                    viewEmp();
                    break;

                case 'Add Department':
                    addDept();
                    break;

                case 'Add Role':
                    getDepts();
                    addRole();
                    break;

                case 'Add Employee':
                    addEmp();
                    break;

                case 'Update Employee Role':
                    updateEmp();
                    break;
                
                case 'End Application':
                    end();
                    break;
            }
        })
};

// View ALL Departments
const viewDept = () => {
    connection.query('SELECT id, deptName AS Department FROM departments',
    function(err, results, fields) {
        if (err) throw err;
        //console.log("Results: ",results);
        console.table('\n', results, '\n');
        startMenu();
    })
    
};

// View ALL Roles
const viewRoles = () => {
    connection.query(`SELECT id AS 'ID', jobTitle AS 'Job Title', dept_id AS 'Dept ID', salary AS 'Salary' FROM roles`,
        function(err, results, fields) {
            if (err) throw err;
            console.table(results , '\n');
            startMenu();
        })
};

// View ALL Employees
const viewEmp = () => {
    const query = `SELECT id, fName AS 'First Name', lName AS 'Last Name', role_id, manager_id FROM employees`;
    //const sql = 'SELECT * FROM employees';
    connection.query(query,
        function(err,results,fields) {
            if (err) throw err;
            console.table('\n', results, '\n');
            startMenu();
        })
};

// Add a Department
const addDept = () => {
    inquirer
        .prompt({
            name: 'depName',
            type: 'input',
            message: 'Please enter a Department Name:',
            // add validation
        })
        .then(answer => {
            const query = connection.query('INSERT INTO departments SET ?',
            {
                deptName: answer.depName,
            },
            function(err,res,fields) {
                if (err) throw err;
                console.log(res.affectedRows + ' record INSERTED');
                startMenu();
            });
            console.log(query.sql);
        })
};

// Get departments for array - do I need this?
const getDepts = () => {
    
};

// Add a Role
const addRole = () => {
    // get departments here first for array list below?
    inquirer
        .prompt([
            {
            name: 'roleName',
            type: 'input',
            message: 'Please enter a Job Title: ',
            // add validation
            },
            {
            name: 'salary',
            type: 'input',
            message: "What is the job's Salary? ",
            },
            {
            name: 'roleDept',
            type: 'list',
            message: 'What department does the job belong to?',
            choices: departments,
            },
        ])
        .then(answer => {
            const query = connection.query('INSERT INTO roles SET ?',
            {
                jobTitle: answer.roleName,
                salary: answer.salary,
                dept_id: answer.roleDept,
            },
            function(err,res,fields) {
                if (err) throw err;
                console.log(res.affectedRows + ' record INSERTED');
                startMenu();
            })
            console.log(query.sql);
        })
};

const end = () => {
    console.log('Thank You');
    connection.end();
}