document.addEventListener("DOMContentLoaded", () => {
    const feedbackForm = document.getElementById("feedback-form");

    feedbackForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission

        // Retrieve the feedback message from the textarea
        const feedbackMessage = document.getElementById("feedback").value.trim();

        if (feedbackMessage) {
            // Retrieve existing feedback messages from localStorage
            let feedbackMessages = JSON.parse(localStorage.getItem("feedbackMessages")) || [];

            // Add new feedback message
            feedbackMessages.push(feedbackMessage);

            // Save updated feedback messages back to localStorage
            localStorage.setItem("feedbackMessages", JSON.stringify(feedbackMessages));

            // Log to ensure message was saved
            console.log("Feedback saved:", feedbackMessage);

            // Show confirmation message to the user
            const confirmationMessage = document.getElementById("confirmation-message");
            confirmationMessage.textContent = "Thank you for your feedback!";
            confirmationMessage.style.display = "block";

            // Clear the form
            feedbackForm.reset();
        }
    });
});
