document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("error-message");

    // Admin credentials updated
    const adminCredentials = {
        username: "admin",
        password: "admin"
    };

    // Load employee credentials from localStorage
    let employees = JSON.parse(localStorage.getItem("employees")) || [];

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        // Check admin credentials
        if (username === adminCredentials.username && password === adminCredentials.password) {
            // Redirect to admin.html if login is successful
            window.location.href = "admin.html";
            return;
        }

        // Check employee credentials
        const employee = employees.find(emp => emp.username === username && emp.password === password);
        if (employee) {
            // Redirect to employee.html if employee login is successful
            window.location.href = "employee.html";
        } else {
            // Show error message if login fails
            errorMessage.textContent = "Invalid username or password. Please try again.";
            errorMessage.style.display = "block";
        }
    });
});
