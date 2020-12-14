const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');
const logo = require('asciiart-logo');

// Table arrays for inquirer choice lists
let departmentsArray = [];
let managersArray = [];
let rolesArray = [];
let employeesArray = [];

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

// Print Employee Tracker Logo
console.log(
    logo({
        name: 'Employee Tracker',
        //font: 'Avatar',
        font: 'Cyberlarge',
        //font: 'Broadway KB',
        //font: 'ANSI Shadow',
        lineChars: 10,
        padding: 1,
        margin: 2,
        borderColor: 'yellow',
        logoColor: 'bold-cyan',
        //textColor: 'yellow',
    })
    //.emptyLine()
    //.right("Jason Barnes 2020")
    .render()
);

// Start Menu to Choose Task
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
                    'View Employees by Department',
                    'View Employee by Manager',
                    new inquirer.Separator(),
                    'Add Department',
                    'Add Role',
                    'Add Employee',
                    new inquirer.Separator(),
                    'Update Employee Role',
                    'Update Employee Manager',
                    new inquirer.Separator(),
                    'End Application',
                    new inquirer.Separator(),
                ],
            }
        ]).then(startTask => {
            
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
                
                case 'View Employees by Department':
                    getDepts();
                    setTimeout(viewEmpbyDept, 500);
                    break;

                case 'View Employee by Manager':
                    getManagers();
                    setTimeout(viewEmpbyMan, 500);
                    break;

                case 'Add Department':
                    addDept();
                    break;

                case 'Add Role':
                    getDepts();
                    setTimeout(addRole, 500);
                    break;

                case 'Add Employee':
                    getRoles();
                    getManagers();
                    setTimeout(addEmp, 500);
                    break;

                case 'Update Employee Role':
                    getEmp();
                    getRoles();
                    setTimeout(updateEmp, 500);
                    break;

                case 'Update Employee Manager':
                    getEmp();
                    getManagers();
                    setTimeout(updateMan, 500);
                    break;
                
                case 'End Application':
                    end();
                    break;
            }
        })
};

// View ALL Departments
const viewDept = () => {
    connection.query(`SELECT id AS 'ID', deptName AS Department FROM departments`,
    function(err, results, fields) {
        if (err) throw err;
        //console.log("Results: ",results);
        console.log('\n','-- Company Departments --');
        console.table(results);
        startMenu();
    })
};

// View ALL Job Roles
const viewRoles = () => {
    let query = `SELECT roles.id AS 'ID', jobTitle AS 'Job Title', salary AS 'Salary', deptName AS 'Department Name'
    FROM roles
    LEFT JOIN departments
    ON roles.dept_id = departments.id;`
    
    connection.query(query,
        function(err, results, fields) {
            if (err) throw err;
            console.log('\n','-- Employee Roles --');
            console.table(results);
            startMenu();
        })
};

// View ALL Employees
const viewEmp = () => {
    const query = `SELECT e.id AS 'ID', fName AS 'First Name', lName AS 'Last Name', jobTitle AS 'Job Title', salary as 'Salary', deptName AS 'Dept Name',
    (SELECT concat(fName,' ',lName) FROM employees as emp WHERE e.manager_id = emp.id) AS 'Manager'          
        FROM employees e
        LEFT JOIN roles
        ON e.role_id = roles.id
        LEFT JOIN departments
        ON dept_id = departments.id;`
    //const sql = 'SELECT * FROM employees';
    connection.query(query,
        function(err,results,fields) {
            if (err) throw err;
            console.log('\n','-- Employees --')
            console.table(results);
            startMenu();
        })
};

// View ALL Employees by Department
const viewEmpbyDept = () => {
    // Get department choice
    inquirer
    .prompt([
        {
        type: 'list',
        name: 'task',
        message: 'Which Deparment to View? ',
        choices: departmentsArray.map(dept => dept.deptName),
        }
    ])
    .then(answer => {
        
        const query = `SELECT employees.id AS 'ID', fName AS 'First Name', lName AS 'Last Name', jobTitle AS 'Job Title', salary as 'Salary', deptName AS 'Dept Name'
        FROM employees
        LEFT JOIN roles
        ON role_id = roles.id
        LEFT JOIN departments
        ON dept_id = departments.id
        WHERE ?`
        
        connection.query(query,
        {
            deptName:answer.task,
        },
        function(err,res,fields) {
            if (err) throw err;
            console.log(`\n -- Employees within ${answer.task} Department --`);
            console.table(res);
            startMenu();
        }); 
    })
};

// View ALL Employees by Manager
const viewEmpbyMan = () => {
    // Get Manager choice
    inquirer
    .prompt([
        {
        type: 'list',
        name: 'manager',
        message: 'Which Manger to View? ',
        choices: managersArray.map(manager => manager.name),
        }
    ])
    .then(answer => {
        let manId = managersArray.filter(manager => manager.name === answer.manager); 
        const query = `SELECT e.id AS 'ID', fName AS 'First Name', lName AS 'Last Name', jobTitle AS 'Job Title', salary as 'Salary', deptName AS 'Dept Name',
        (SELECT concat(fName,' ',lName) FROM employees as emp WHERE e.manager_id = emp.id) AS 'Manager'          
            FROM employees e
            LEFT JOIN roles
            ON e.role_id = roles.id
            LEFT JOIN departments
            ON dept_id = departments.id
            WHERE ?`;
        
        connection.query(query,
        {
            manager_id:manId[0].id,
        },
        function(err,res) {
            if (err) throw err;
            console.log(`\n -- Employees with ${answer.manager} for Manager --`);
            console.table(res);
            startMenu();
        }); 
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
            function(err,res) {
                if (err) throw err;
                console.log('\n', res.affectedRows + ' Department INSERTED','\n');
                startMenu();
            });
            //console.log(query.sql);
        })
};

// Add a Job Role
const addRole = () => {

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
            // create list from database departments json
            choices: departmentsArray.map(dept => dept.deptName),
            },
        ])
        .then(answer => {
            // Get department ID based on Role chosen
            let deptId = departmentsArray.filter(dept => dept.deptName === answer.roleDept);
            const query = connection.query('INSERT INTO roles SET ?',
            {
                jobTitle: answer.roleName,
                salary: answer.salary,
                dept_id: deptId[0].id,
            },
            function(err,res,fields) {
                if (err) throw err;
                console.log('\n', res.affectedRows + ' Role INSERTED','\n');
                startMenu();
            })
            
        })
};

// Add Employee
const addEmp = () => {
    inquirer
    .prompt([
        {
        name: 'first_name',
        type: 'input',
        message: "Please enter Employee's First Name: ",
        // add validation
        },
        {
        name: 'last_name',
        type: 'input',
        message: "Please enter Employee's Last Name: ",
        },
        {
        name: 'jobRole',
        type: 'list',
        message: "What is the Employee's Role? ",
        // create list from database role json
        choices: rolesArray.map(role => role.jobTitle),
        },
        {
        name: 'manager',
        type: 'list',
        message: "Who is the Employee's Manger? ",
        // create list from database managers json
        choices:  managersArray.map(manager => manager.name),
        },
    ])
    .then(answer => {
        // Get Role and Manager IDs
        let roleId = rolesArray.filter(role => role.jobTitle === answer.jobRole);
        let managerId = managersArray.filter(manager => manager.name === answer.manager);
        
        const query = connection.query('INSERT INTO employees SET ?',
        {
            fName: answer.first_name,
            lName: answer.last_name,
            role_id: roleId[0].id,
            manager_id: managerId[0].id,
        },
        function(err,res,fields) {
            if (err) throw err;
            console.log('\n',res.affectedRows + ' Employee INSERTED','\n');
            startMenu();
        })
        //console.log(query.sql);
    })
};

// Update Employee Role
const updateEmp = () => {

    inquirer
    .prompt([
        {
        name: 'emp_name',
        type: 'list',
        message: "Choose the Employee to edit: ",
        choices: employeesArray.map(emp => emp.name),
        },
        {
        name: 'emp_role',
        type: 'list',
        message: "Select the Employee's new Role: ",
        choices: rolesArray.map(role => role.jobTitle),
        },
    ])
    .then(answer => {
        // Get employee and role objects based on choices
        let empId = employeesArray.filter(emp => emp.name === answer.emp_name);
        let roleId = rolesArray.filter(role => role.jobTitle === answer.emp_role);
        
        const query = connection.query('UPDATE employees SET ? WHERE ?',
        [
        {
            role_id: roleId[0].id,
        },
        {
            id: empId[0].id,
        }
        ],
        function(err,res) {
            if (err) throw err;
            console.log('\n', res.affectedRows + ' employee UPDATED','\n');
            startMenu();
        });
    });
};

// Update Employee Manager
const updateMan = () => {

    inquirer
    .prompt([
        {
        name: 'emp_name',
        type: 'list',
        message: "Choose the Employee to edit: ",
        choices: employeesArray.map(emp => emp.name),
        },
        {
        name: 'emp_man',
        type: 'list',
        message: "Select the Employee's Manager: ",
        choices: managersArray.map(manager => manager.name),
        },
    ])
    .then(answer => {
        // Get employee and role objects based on choices
        let empId = employeesArray.filter(emp => emp.name === answer.emp_name);
        let manId = managersArray.filter(manager => manager.name === answer.emp_man);

        const query = connection.query('UPDATE employees SET ? WHERE ?',
        [
        {
            manager_id: manId[0].id,
        },
        {
            id: empId[0].id,
        }
        ],
        function(err,res) {
            if (err) throw err;
            console.log('\n', res.affectedRows + ' employee UPDATED','\n');
            startMenu();
        });
    });
};

// Get Employees for array
const getEmp = () => {
    let query = `SELECT id, fName, lName
                FROM employees;`;
    connection.query(query,
        function(err,results,fields){
            if (err) throw err;

            results.forEach(emp => {
                //create array of employees
                employeesArray.push({id:emp.id, name:`${emp.fName} ${emp.lName}`});
            })
            //console.log("Employees Array: ",employeesArray);
        });
};

// Get managers for array
const getManagers = () => {
    // query Employees that are managers
    const query = `SELECT employees.id as 'id', fName, lName, role_id, roles.jobTitle 
                    FROM employees
                    LEFT JOIN roles
                    ON employees.role_id = roles.id
                    WHERE jobTitle LIKE '%Manager%';`;
    
    connection.query(query,
        function(err,results,fields){
            if (err) throw err;

            results.forEach(employee => {
                //create array of employees that are managers
                managersArray.push({id:employee.id, name:`${employee.fName} ${employee.lName}`, role_id:employee.role_id, jobTitle: employee.jobTitle});
            })
        });
};

// Get departments for array
const getDepts = () => {
    const query = 'SELECT * FROM departments';
    
    connection.query(query,
        function(err,results,fields){
            if (err) throw err;

            results.forEach(dept => {
                //create array of departments
                departmentsArray.push({id:dept.id, deptName:dept.deptName});
            })
        });
};

// Get Job Roles and Managers for array
const getRoles = () => {
    const query = 'SELECT id, jobTitle FROM roles';
    connection.query(query,
        function(err,results,fields){
            if (err) throw err;

            results.forEach(role => {
                //create array of job roles
                rolesArray.push({id:role.id, jobTitle:role.jobTitle});
            })
            // After finish get Managers for choices
            //getManagers();
            //console.log('rolesArray :', rolesArray); 
        });
};

const end = () => {
    console.log('Thank You');
    connection.end();
}