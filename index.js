const inquirer = require('inquirer');

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
                    'Update an employee role'
                ]
            }
        ]).then(startTask => {
            console.log(startTask.task);
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
            }
        })
};


// Initialsize with startMenu
startMenu();