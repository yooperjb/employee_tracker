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
        textColor: 'yellow',
    })
    //.emptyLine()
    //.right("@ianasqazi v1.0")
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
                    new inquirer.Separator(),
                    'Add Department',
                    'Add Role',
                    'Add Employee',
                    new inquirer.Separator(),
                    'Update Employee Role',
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
                    //updateEmp();
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
        console.log('\n','Company Departments');
        console.table(results,'\n');
        startMenu();
    })
};

// View ALL Job Roles
const viewRoles = () => {
    let query = `SELECT roles.id AS 'ID', jobTitle AS 'Job Title', salary AS 'Salary', deptName AS 'Department  Name'
    FROM roles
    LEFT JOIN departments
    ON roles.dept_id = departments.id;`
    
    connection.query(query,
        function(err, results, fields) {
            if (err) throw err;
            console.log('\n','Employee Roles');
            console.table(results , '\n');
            startMenu();
        })
};

// View ALL Employees
const viewEmp = () => {
    const query = `SELECT employees.id AS 'ID', fName AS 'First Name', lName AS 'Last Name', jobTitle AS 'Job Title', salary as 'Salary', deptName AS 'Dept Name'           FROM employees
                LEFT JOIN roles
                ON employees.role_id = roles.id
                LEFT JOIN departments
                ON dept_id = departments.id ;`
    //const sql = 'SELECT * FROM employees';
    connection.query(query,
        function(err,results,fields) {
            if (err) throw err;
            console.log('Employees')
            console.table(results, '\n');
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
            console.log('departmentsArray :', departmentsArray);
            //addRole();
        });
    //console.log("Departments2: ", departmentsArray);
};

// Add a Job Role
const addRole = () => {
    // get departments from database
    //const departArray = await getDepts();
    //console.log(departmentsArray.map(dept => dept.deptName));
    //console.log(typeof departArray);
    //console.log("Departments Array: ", departArray);

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
                console.log('\n', res.affectedRows + ' record INSERTED','\n');
                startMenu();
            })
            //console.log(query.sql);
        })
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

// Get managers for array
const getManagers = () => {
    // query Employees that are managers
    const query = `SELECT employees.id as 'id', fName, lName, role_id, roles.jobTitle 
                    FROM employees
                    LEFT JOIN roles
                    ON employees.role_id = roles.id
                    WHERE jobTitle LIKE '%Manager%'`;
    
    connection.query(query,
        function(err,results,fields){
            if (err) throw err;

            results.forEach(employee => {
                //create array of employees that are managers
                managersArray.push({id:employee.id, name:`${employee.fName} ${employee.lName}`, role_id:employee.role_id, jobTitle: employee.jobTitle});
            })
            //console.log('managersArray :', managersArray);
            // After finish call addEmp() to add employee
            //addEmp(); 
        });
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
        choices: managersArray.map(manager => manager.name),
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
            console.log('\n',res.affectedRows + ' record INSERTED','\n');
            startMenu();
        })
        console.log(query.sql);
    })
};

// Get Employees for array
const getEmp = () => {
    
};

// Update Employee
const updateEmp = () => {

};

const end = () => {
    console.log('Thank You');
    connection.end();
}