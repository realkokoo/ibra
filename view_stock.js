document.addEventListener("DOMContentLoaded", () => {
    const perfumesList = document.getElementById("perfumes-list");
    const editModal = document.getElementById("edit-modal");
    const editForm = document.getElementById("edit-form");
    const editNameInput = document.getElementById("edit-name");
    const editImageInput = document.getElementById("edit-image");
    const editSizesContainer = document.getElementById("edit-sizes-container");
    const closeButton = document.querySelector(".close-button");
    const addSizeButton = document.getElementById("add-size-button");
    const editImagePreview = document.getElementById("edit-image-preview");

    // Retrieve perfumes from localStorage
    let perfumes = JSON.parse(localStorage.getItem("perfumes")) || [];

    // Function to render perfumes
    const renderPerfumes = () => {
        perfumesList.innerHTML = ""; // Clear current list
        perfumes.forEach((perfume, index) => {
            const perfumeCard = document.createElement("div");
            perfumeCard.classList.add("perfume-card");

            perfumeCard.innerHTML = `
                <img src="${perfume.image}" alt="${perfume.name}">
                <h3>${perfume.name}</h3>
                <button class="edit-button" data-index="${index}">Edit</button>
                <button class="remove-button" data-index="${index}">Remove</button>
            `;

            // Event listener for edit button
            perfumeCard.querySelector(".edit-button").addEventListener("click", () => {
                openEditModal(index);
            });

            // Event listener for remove button
            perfumeCard.querySelector(".remove-button").addEventListener("click", () => {
                removePerfume(index);
            });

            perfumesList.appendChild(perfumeCard);
        });
    };

    // Open edit modal
    const openEditModal = (index) => {
        const perfume = perfumes[index];
        editNameInput.value = perfume.name;
        editSizesContainer.innerHTML = ""; // Clear previous size entries

        // Populate size entries
        perfume.sizes.forEach((size, sizeIndex) => {
            const sizeEntry = document.createElement("div");
            sizeEntry.classList.add("size-entry");
            sizeEntry.innerHTML = `
                <input type="number" value="${size.size.replace(/[^\d]/g, "")}" placeholder="Size (mL)" class="size-input" required>
                <input type="number" value="${parseFloat(size.price.replace(/[^\d.]/g, "")).toFixed(2)}" placeholder="Price (OMR)" class="price-input" required>
                <button type="button" class="remove-size-button">Remove</button>
            `;

            sizeEntry.querySelector(".remove-size-button").addEventListener("click", () => {
                sizeEntry.remove();
            });

            editSizesContainer.appendChild(sizeEntry);
        });

        editForm.dataset.index = index; // Store index in form dataset
        editModal.classList.remove("hidden");
    };

    // Close edit modal
    closeButton.addEventListener("click", () => {
        editModal.classList.add("hidden");
    });

    // Event listener for saving edited perfume
    editForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const index = editForm.dataset.index;
        const updatedPerfume = {
            ...perfumes[index],
            name: editNameInput.value.trim(),
            sizes: []
        };

        // Update sizes
        const sizeEntries = editSizesContainer.querySelectorAll(".size-entry");
        sizeEntries.forEach((entry) => {
            const size = entry.querySelector(".size-input").value;
            const price = entry.querySelector(".price-input").value;
            updatedPerfume.sizes.push({
                size: `${size} mL`,
                price: `OMR ${parseFloat(price).toFixed(2)}`
            });
        });

        // Update image if new one is selected
        if (editImageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                updatedPerfume.image = e.target.result;
                saveChanges(index, updatedPerfume);
            };
            reader.readAsDataURL(editImageInput.files[0]);
        } else {
            saveChanges(index, updatedPerfume);
        }
    });

    // Save changes and update localStorage
    const saveChanges = (index, updatedPerfume) => {
        perfumes[index] = updatedPerfume;
        localStorage.setItem("perfumes", JSON.stringify(perfumes));
        editModal.classList.add("hidden");
        renderPerfumes();
    };

    // Remove perfume
    const removePerfume = (index) => {
        perfumes.splice(index, 1);
        localStorage.setItem("perfumes", JSON.stringify(perfumes));
        renderPerfumes();
    };

    // Add new size input
    addSizeButton.addEventListener("click", () => {
        const sizeEntry = document.createElement("div");
        sizeEntry.classList.add("size-entry");
        sizeEntry.innerHTML = `
            <input type="number" placeholder="Size (mL)" class="size-input" required>
            <input type="number" placeholder="Price (OMR)" class="price-input" required>
            <button type="button" class="remove-size-button">Remove</button>
        `;

        sizeEntry.querySelector(".remove-size-button").addEventListener("click", () => {
            sizeEntry.remove();
        });

        editSizesContainer.appendChild(sizeEntry);
    });

    // Render perfumes on page load
    renderPerfumes();
});
