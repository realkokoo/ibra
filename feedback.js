document.addEventListener("DOMContentLoaded", () => {
    const feedbackList = document.getElementById("feedback-list");
    const clearAllButton = document.getElementById("clear-all");

    // Retrieve feedback messages from localStorage
    let feedbackMessages = JSON.parse(localStorage.getItem("feedbackMessages")) || [];

    // Function to render feedback messages
    const renderFeedback = () => {
        feedbackList.innerHTML = ""; // Clear the list

        if (feedbackMessages.length > 0) {
            feedbackMessages.forEach((message, index) => {
                const feedbackItem = document.createElement("div");
                feedbackItem.classList.add("feedback-item");

                // Feedback message text
                const feedbackText = document.createElement("span");
                feedbackText.textContent = message;

                // Delete button
                const deleteButton = document.createElement("button");
                deleteButton.classList.add("delete-button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", () => {
                    deleteFeedback(index);
                });

                feedbackItem.appendChild(feedbackText);
                feedbackItem.appendChild(deleteButton);
                feedbackList.appendChild(feedbackItem);
            });
        } else {
            const noFeedbackMessage = document.createElement("p");
            noFeedbackMessage.textContent = "No feedback available yet.";
            feedbackList.appendChild(noFeedbackMessage);
        }
    };

    // Function to delete specific feedback
    const deleteFeedback = (index) => {
        feedbackMessages.splice(index, 1); // Remove the specific feedback
        localStorage.setItem("feedbackMessages", JSON.stringify(feedbackMessages));
        renderFeedback(); // Re-render the feedback list
    };

    // Event listener for clearing all feedback
    clearAllButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all feedback?")) {
            feedbackMessages = []; // Clear all feedback
            localStorage.setItem("feedbackMessages", JSON.stringify(feedbackMessages));
            renderFeedback(); // Re-render the feedback list
        }
    });

    // Initial rendering of feedback messages
    renderFeedback();
});
