document.addEventListener("DOMContentLoaded", () => {
    const perfumesSection = document.getElementById("perfumes-section");
    const perfumePopup = document.getElementById("perfume-popup");
    const viewPerfumesButton = document.getElementById("view-perfumes-button");
    const popupImage = document.getElementById("popup-image");
    const popupName = document.getElementById("popup-name");
    const popupSizes = document.getElementById("popup-sizes");
    const popupPrice = document.getElementById("popup-price");
    const closeButton = document.querySelector(".close-button");

    // Scroll to perfumes section when clicking the "View Perfumes" button with slower behavior
    if (viewPerfumesButton) {
        viewPerfumesButton.addEventListener("click", () => {
            window.scrollTo({
                top: perfumesSection.offsetTop,
                behavior: 'smooth'
            });
        });
    }

    // Retrieve perfumes from localStorage
    const perfumes = JSON.parse(localStorage.getItem("perfumes")) || [];

    // Function to render all perfumes on the page
    const renderPerfumes = () => {
        perfumesSection.innerHTML = ""; // Clear the container
        perfumes.forEach((perfume, index) => {
            const perfumeCard = document.createElement("div");
            perfumeCard.classList.add("perfume-card");

            // Extract and ensure price is numeric
            const initialPrice = parseFloat(perfume.sizes[0].price.replace(/[^\d.]/g, ""));

            perfumeCard.innerHTML = `
                <img src="${perfume.image}" alt="${perfume.name}">
                <h3>${perfume.name}</h3>
                <select class="volume-select" data-index="${index}">
                    ${perfume.sizes.map(size => `<option value="${size.size}">${size.size}</option>`).join("")}
                </select>
                <p class="price">OMR ${initialPrice.toFixed(2)}</p>
            `;

            // Event listener to update price when selecting size
            perfumeCard.querySelector(".volume-select").addEventListener("change", function (e) {
                e.stopPropagation(); // Prevent click event from triggering popup
                const selectedSize = this.value;
                const perfumeData = perfumes[this.dataset.index];
                const selectedSizeData = perfumeData.sizes.find(size => size.size === selectedSize);

                // Ensure the price is numeric before displaying
                const updatedPrice = parseFloat(selectedSizeData.price.replace(/[^\d.]/g, ""));
                perfumeCard.querySelector(".price").textContent = `OMR ${updatedPrice.toFixed(2)}`;
            });

            // Event listener to open popup when perfume card is clicked (excluding dropdown)
            perfumeCard.addEventListener("click", (event) => {
                if (event.target.tagName === "SELECT") {
                    return; // Prevent dropdown click from opening the popup
                }

                const perfumeData = perfumes[index];
                popupImage.src = perfumeData.image;
                popupName.textContent = perfumeData.name;

                // Generate size options for popup
                popupSizes.innerHTML = "";
                perfumeData.sizes.forEach(size => {
                    const sizeButton = document.createElement("button");
                    sizeButton.classList.add("size-button");
                    sizeButton.textContent = `${size.size}`;
                    sizeButton.addEventListener("click", () => {
                        const selectedPrice = parseFloat(size.price.replace(/[^\d.]/g, ""));
                        popupPrice.textContent = `OMR ${selectedPrice.toFixed(2)}`;
                    });
                    popupSizes.appendChild(sizeButton);
                });

                // Default to the first price when opening the popup
                const defaultPrice = parseFloat(perfumeData.sizes[0].price.replace(/[^\d.]/g, ""));
                popupPrice.textContent = `OMR ${defaultPrice.toFixed(2)}`;

                // Show the popup
                perfumePopup.classList.remove("hidden");
            });

            perfumesSection.appendChild(perfumeCard);
        });
    };

    // Render perfumes on page load
    renderPerfumes();

    // Close popup when clicking the close button
    closeButton.addEventListener("click", () => {
        perfumePopup.classList.add("hidden");
    });

    // Close popup when clicking outside of the popup content
    perfumePopup.addEventListener("click", (e) => {
        if (e.target === perfumePopup) {
            perfumePopup.classList.add("hidden");
        }
    });
});
