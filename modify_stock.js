document.addEventListener("DOMContentLoaded", () => {
    const addPerfumeForm = document.getElementById("add-perfume-form");
    const addSizeButton = document.getElementById("add-size-button");
    const sizesContainer = document.getElementById("sizes-container");
    const perfumeImageInput = document.getElementById("perfume-image");
    const imagePreview = document.getElementById("image-preview");

    // Event listener for adding a new size entry
    addSizeButton.addEventListener("click", () => {
        const sizeEntry = document.createElement("div");
        sizeEntry.classList.add("size-entry");
        sizeEntry.innerHTML = `
            <input type="number" class="size-input" placeholder="Size (mL)" required>
            <input type="number" class="price-input" placeholder="Price (OMR)" required>
            <button type="button" class="remove-size-button">Remove</button>
        `;
        sizesContainer.appendChild(sizeEntry);

        // Add an event listener for the remove button
        sizeEntry.querySelector(".remove-size-button").addEventListener("click", () => {
            sizeEntry.remove();
        });
    });

    // Event listener to handle image preview
    perfumeImageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Perfume Image Preview" class="image-preview">`;
            };
            reader.readAsDataURL(file); // Convert image to base64
        }
    });

    // Event listener for adding a new perfume
    addPerfumeForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const perfumeName = document.getElementById("perfume-name").value.trim();
        const perfumeType = document.getElementById("perfume-type").value;
        const perfumeGender = document.getElementById("perfume-gender").value;

        // Get base64 encoded image from the preview
        const perfumeImage = imagePreview.querySelector('img') ? imagePreview.querySelector('img').src : '';

        const sizes = [];
        const sizeEntries = document.querySelectorAll(".size-entry");
        sizeEntries.forEach((entry) => {
            const size = entry.querySelector(".size-input").value;
            const price = entry.querySelector(".price-input").value;
            sizes.push({ size: `${size} mL`, price: `OMR ${price}` });
        });

        // Creating a perfume object
        const newPerfume = {
            name: perfumeName,
            image: perfumeImage,
            type: perfumeType,
            gender: perfumeGender,
            sizes: sizes
        };

        // Storing the perfume in localStorage
        let perfumes = JSON.parse(localStorage.getItem("perfumes")) || [];
        perfumes.push(newPerfume);
        localStorage.setItem("perfumes", JSON.stringify(perfumes));

        // Clear the form after submission
        addPerfumeForm.reset();
        imagePreview.innerHTML = ""; // Clear the image preview
        sizesContainer.innerHTML = `
            <h3>Available Sizes:</h3>
            <div class="size-entry">
                <input type="number" class="size-input" placeholder="Size (mL)" required>
                <input type="number" class="price-input" placeholder="Price (OMR)" required>
                <button type="button" class="remove-size-button">Remove</button>
            </div>
        `;
    });
});
