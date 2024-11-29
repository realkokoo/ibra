document.addEventListener("DOMContentLoaded", () => {
    const employeeTableBody = document.getElementById("employee-table-body");
    const addEmployeeButton = document.getElementById("add-employee");

    // Load employees from localStorage
    let employees = JSON.parse(localStorage.getItem("employees")) || [];

    // Function to render employee list in the table
    function renderEmployees() {
        employeeTableBody.innerHTML = ""; // Clear the employee table
        employees.forEach((employee, index) => {
            const employeeRow = document.createElement("tr");

            // Employee name, username, and password columns - not editable initially
            const passwordDisplay = employee.password === "password" ? "password" : "*****"; // Show placeholder for new rows, otherwise censor password

            employeeRow.innerHTML = `
                <td class="employee-data" contenteditable="false">${employee.name}</td>
                <td class="employee-data" contenteditable="false">${employee.username}</td>
                <td class="employee-data password-data" data-password="${employee.password}" contenteditable="false">${passwordDisplay}</td>
            `;

            // Actions column
            const actionsCell = document.createElement("td");
            actionsCell.style.textAlign = "center"; // Center-align actions column content

            // Remove button
            const removeButton = document.createElement("button");
            removeButton.classList.add("action-button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", () => {
                removeEmployee(index);
            });

            // Edit button
            const editButton = document.createElement("button");
            editButton.classList.add("action-button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => {
                toggleEditMode(employeeRow, editButton, saveButton);
            });

            // Save button (initially hidden)
            const saveButton = document.createElement("button");
            saveButton.classList.add("action-button");
            saveButton.textContent = "Save";
            saveButton.style.display = "none"; // Initially hidden
            saveButton.addEventListener("click", () => {
                editEmployee(index, employeeRow);
                toggleEditMode(employeeRow, editButton, saveButton); // Switch back to non-edit mode after saving
            });

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(saveButton);
            actionsCell.appendChild(removeButton);
            employeeRow.appendChild(actionsCell);
            employeeTableBody.appendChild(employeeRow);

            // Add event listeners to newly added rows to clear placeholder text on first click
            addClearOnFirstClickEvent(employeeRow);

            // Add hover event listener to reveal the password
            addPasswordHoverEvent(employeeRow);
        });
    }

    // Function to toggle edit mode on employee rows
    function toggleEditMode(employeeRow, editButton, saveButton) {
        const cells = employeeRow.querySelectorAll(".employee-data");
        const passwordCell = employeeRow.querySelector(".password-data");

        if (editButton.textContent === "Edit") {
            // Switch to edit mode
            cells.forEach(cell => {
                cell.style.width = `${cell.offsetWidth}px`; // Lock the width of the cell
                cell.contentEditable = "true";
                cell.classList.add("editable-highlight"); // Highlight editable cells
            });
            passwordCell.textContent = passwordCell.dataset.password; // Show actual password while editing
            editButton.style.display = "none";
            saveButton.style.display = "inline-block";
        } else {
            // Exit edit mode
            cells.forEach(cell => {
                cell.contentEditable = "false";
                cell.classList.remove("editable-highlight");
            });
            // Hide the password again after editing
            passwordCell.textContent = passwordCell.dataset.password === "password" ? "password" : "*****";
            editButton.style.display = "inline-block";
            saveButton.style.display = "none";
        }
    }

    // Function to add a new employee
    function addEmployee() {
        const newEmployee = {
            name: "New Employee", // Placeholder for the new employee's name
            username: "username", // Placeholder username
            password: "password" // Placeholder password text for new rows
        };
        employees.push(newEmployee);
        localStorage.setItem("employees", JSON.stringify(employees));
        renderEmployees();
        // Highlight the newly added row
        highlightNewRow();
    }

    // Function to highlight the newly added row
    function highlightNewRow() {
        const lastRow = employeeTableBody.lastChild;
        if (lastRow) {
            const cells = lastRow.querySelectorAll(".employee-data");
            cells.forEach(cell => {
                cell.contentEditable = "true";
                cell.classList.add("editable-highlight");
            });
            // Also show that this row is in edit mode (use "Save" instead of "Edit")
            const editButton = lastRow.querySelector(".action-button");
            editButton.style.display = "none";
            const saveButton = lastRow.querySelectorAll(".action-button")[1];
            saveButton.style.display = "inline-block";
        }
    }

    // Function to add event listeners to newly added rows to clear placeholder text on first click
    function addClearOnFirstClickEvent(employeeRow) {
        const cells = employeeRow.querySelectorAll(".employee-data");
        cells.forEach(cell => {
            cell.addEventListener("focus", function handleFocus() {
                // Clear the placeholder text when the field is focused for the first time
                if (this.textContent === "New Employee" || this.textContent === "username" || this.textContent === "password") {
                    this.textContent = "";
                }
                // Remove the event listener after the first focus
                cell.removeEventListener("focus", handleFocus);
            });
        });
    }

    // Function to add hover event listeners to password cells to show the password on hover
    function addPasswordHoverEvent(employeeRow) {
        const passwordCell = employeeRow.querySelector(".password-data");

        passwordCell.addEventListener("mouseenter", () => {
            if (!passwordCell.isContentEditable) {
                passwordCell.textContent = passwordCell.dataset.password; // Show password when hovering
            }
        });

        passwordCell.addEventListener("mouseleave", () => {
            if (!passwordCell.isContentEditable) {
                passwordCell.textContent = passwordCell.dataset.password === "password" ? "password" : "*****"; // Hide password when not hovering
            }
        });
    }

    // Function to remove an employee
    function removeEmployee(index) {
        employees.splice(index, 1);
        localStorage.setItem("employees", JSON.stringify(employees));
        renderEmployees();
    }

    // Function to edit an employee's details
    function editEmployee(index, employeeRow) {
        const updatedName = employeeRow.cells[0].textContent.trim();
        const updatedUsername = employeeRow.cells[1].textContent.trim();
        const updatedPassword = employeeRow.cells[2].textContent.trim();

        employees[index] = {
            name: updatedName,
            username: updatedUsername,
            password: updatedPassword
        };
        localStorage.setItem("employees", JSON.stringify(employees));
        renderEmployees();
    }

    // Handle add employee button click
    addEmployeeButton.addEventListener("click", () => {
        addEmployee();
    });

    // Initial rendering of employee list
    renderEmployees();
});
