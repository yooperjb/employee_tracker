-- View Employees
SELECT e.id AS 'ID', fName AS 'First Name', lName AS 'Last Name', jobTitle AS 'Job Title', salary as 'Salary', deptName AS 'Dept Name',
(SELECT concat(fName,' ',lName) FROM employees as emp WHERE e.manager_id = emp.id) AS 'Manager'          
    FROM employees e
    LEFT JOIN roles
    ON e.role_id = roles.id
    LEFT JOIN departments
    ON dept_id = departments.id;

-- View employees by department
SELECT employees.id AS 'ID', fName AS 'First Name', lName AS 'Last Name', jobTitle AS 'Job Title', salary as 'Salary', deptName AS 'Dept Name'
        FROM employees
        LEFT JOIN roles
        ON role_id = roles.id
        LEFT JOIN departments
        ON dept_id = departments.id
        WHERE ?

-- View employees by Manager
SELECT e.id AS 'ID', fName AS 'First Name', lName AS 'Last Name', jobTitle AS 'Job Title', salary as 'Salary', deptName AS 'Dept Name',
(SELECT concat(fName,' ',lName) FROM employees as emp WHERE e.manager_id = emp.id) AS 'Manager'          
    FROM employees e
    LEFT JOIN roles
    ON e.role_id = roles.id
    LEFT JOIN departments
    ON dept_id = departments.id
    WHERE ?;
    --WHERE e.manager_id = 1;