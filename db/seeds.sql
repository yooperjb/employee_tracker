INSERT INTO departments (deptName) values
('Executive'),
('Manager'),
('Operations');

INSERT INTO roles (jobTitle,dept_id,salary) values
('Chief Executive Officer', 1, 134000),
('Chief Technical Officer', 1, 125000),
('President', 1, 120000),
('Marketing Manager', 2, 75000),
('Project Manager', 2, 74000),
('Human Resource Manager', 2, 68000),
('Marketing Specialist', 3, 55000),
('Human Resource Personnel', 3, 40000),
('Accountant', 3, 45000),
('Sales Representative', 3, 34000),
('Administrative Assistant', 3, 29000);

INSERT INTO employees (fName,lName,role_id,manager_id) values
('Adelaide', 'Pace', 4, null ),
('Samual', 'Henry', 3, null),
('Alia', 'Irwin', 9, 1),
('Ho', 'Chapman', 11, 6),
('Tyreese', 'Rosa', 10, 1),
('Shayna', 'Castaneda',6, null),
('Maheen', 'Ashton',1, null),
('Jolene', 'Montes',10, 1),
('Malak', 'Bains',7, 1);