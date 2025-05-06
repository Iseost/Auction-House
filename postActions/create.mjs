// Modal to create post
export function showCreatePostModal() {
    if (document.getElementById("createPostModal")) {
        document.getElementById("createPostModal").classList.remove("hidden");
        return;
    }

    const modalOverlay = document.createElement("div");
    modalOverlay.id = "createPostModal";
    modalOverlay.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

    const modalContent = document.createElement("div");
    modalContent.className = "bg-white p-6 rounded-lg shadow-lg w-full max-w-md";  // Smaller box with max-w-md

    const modalTitle = document.createElement("h2");
    modalTitle.className = "text-2xl font-bold font-['Playfair_Display'] text-center mb-6";  // Slightly smaller title
    modalTitle.textContent = "Create a new listing";

    const form = document.createElement("form");
    form.classList.add("flex", "flex-col", "items-start", "w-full", "max-w-md", "space-y-4");

    // --- Title input ---
    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "create_title");
    titleLabel.classList.add("font-medium");
    titleLabel.textContent = "Title";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "create_title";
    titleInput.placeholder = "Title of your item";
    titleInput.classList.add("w-full", "border", "border-gray-300", "rounded", "px-4", "py-2");
    titleInput.required = true;

    form.appendChild(titleLabel);
    form.appendChild(titleInput);

    // --- Deadline input ---
    const deadlineLabel = document.createElement("label");
    deadlineLabel.setAttribute("for", "create_deadline");
    deadlineLabel.classList.add("font-medium");
    deadlineLabel.textContent = "Deadline";

    const deadlineInput = document.createElement("input");
    deadlineInput.type = "datetime-local";
    deadlineInput.id = "create_deadline";
    deadlineInput.classList.add("w-full", "border", "border-gray-300", "rounded", "px-4", "py-2");
    deadlineInput.required = true;

    form.appendChild(deadlineLabel);
    form.appendChild(deadlineInput);

    // --- Image URLs input ---
    const imagesLabel = document.createElement("label");
    imagesLabel.setAttribute("for", "create_images");
    imagesLabel.classList.add("font-medium");
    imagesLabel.textContent = "Image URLs (one per line)";

    const imagesTextarea = document.createElement("textarea");
    imagesTextarea.id = "create_images";
    imagesTextarea.placeholder = "Enter image URLs, one per line";
    imagesTextarea.classList.add("w-full", "h-[120px]", "border", "border-gray-300", "rounded", "px-4", "py-2", "resize-none");  // Smaller textarea
    imagesTextarea.required = true;

    form.appendChild(imagesLabel);
    form.appendChild(imagesTextarea);

    // --- Description input ---
    const descriptionLabel = document.createElement("label");
    descriptionLabel.setAttribute("for", "create_description");
    descriptionLabel.classList.add("font-medium");
    descriptionLabel.textContent = "Description";

    const descriptionTextarea = document.createElement("textarea");
    descriptionTextarea.id = "create_description";
    descriptionTextarea.placeholder = "Describe your item in detail";
    descriptionTextarea.classList.add("w-full", "h-[200px]", "border", "border-gray-300", "rounded", "px-4", "py-2", "resize-none");  // Smaller textarea
    descriptionTextarea.required = true;

    form.appendChild(descriptionLabel);
    form.appendChild(descriptionTextarea);

    // --- Save Button ---
    const saveButton = document.createElement("button");
    saveButton.id = "save_create";
    saveButton.type = "button";
    saveButton.classList.add("bg-[#8B5CF6]", "text-white", "py-2", "px-4", "rounded", "w-full", "mt-4", "hover:bg-[#7c3aed]", "transition");
    saveButton.textContent = "Save";

    form.appendChild(saveButton);

    // --- Cancel Button ---
    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.classList.add("bg-gray-300", "text-black", "py-2", "px-4", "rounded", "w-full", "mt-4", "hover:bg-gray-400", "transition");
    cancelButton.textContent = "Cancel";

    form.appendChild(cancelButton);

    // --- Append form to modal content ---
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(form);

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Close modal on save
    saveButton.addEventListener("click", async () => {
        await handleCreatePost();
        modalOverlay.classList.add("hidden");
    });

    // Close modal on cancel
    cancelButton.addEventListener("click", () => {
        modalOverlay.classList.add("hidden");
    });
}


// Handle submit post
async function handleCreatePost() {
    try {
        const title = document.getElementById("create_title").value.trim();
        const deadline = document.getElementById("create_deadline").value.trim();
        const imageURLs = document.getElementById("create_images").value.trim().split("\n");
        const description = document.getElementById("create_description").value.trim();

        if (!title || !deadline || !imageURLs.length || !description) {
            alert("Please fill in all required fields.");
            return;
        }

        // Her legger du til API-kall for å sende data
        console.log("Creating post with:", { title, deadline, imageURLs, description });

    } catch (error) {
        console.error("Error creating post:", error);
    }
}