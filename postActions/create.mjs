import { createPost } from "../api/postActions.mjs";

export function showCreatePostModal() {
    if (document.getElementById("createPostModal")) {
        document.getElementById("createPostModal").classList.remove("hidden");
        return;
    }

    const modalOverlay = document.createElement("div");
    modalOverlay.id = "createPostModal";
    modalOverlay.className = "fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm";

    const modalContent = document.createElement("div");
    modalContent.className = "bg-white p-6 rounded-lg shadow-lg w-full max-w-md";

    const modalTitle = document.createElement("h2");
    modalTitle.className = "text-2xl font-bold font-['Playfair_Display'] text-center mb-6";
    modalTitle.textContent = "Create a new listing";

    const form = document.createElement("form");
    form.classList.add("flex", "flex-col", "items-start", "w-full", "space-y-4");

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "create_title";
    titleInput.placeholder = "Title of your item";
    titleInput.className = "w-full border border-gray-300 rounded px-4 py-2";
    titleInput.required = true;

    const deadlineInput = document.createElement("input");
    deadlineInput.type = "datetime-local";
    deadlineInput.id = "create_deadline";
    deadlineInput.className = "w-full border border-gray-300 rounded px-4 py-2";
    deadlineInput.required = true;

    const imagesTextarea = document.createElement("textarea");
    imagesTextarea.id = "create_images";
    imagesTextarea.placeholder = "Enter image URLs, one per line";
    imagesTextarea.className = "w-full h-[120px] border border-gray-300 rounded px-4 py-2 resize-none";
    imagesTextarea.required = true;

    const descriptionTextarea = document.createElement("textarea");
    descriptionTextarea.id = "create_description";
    descriptionTextarea.placeholder = "Describe your item in detail";
    descriptionTextarea.className = "w-full h-[200px] border border-gray-300 rounded px-4 py-2 resize-none";
    descriptionTextarea.required = true;

    const saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.className = "bg-Blue_Chill hover:bg-Blue_Chill/80 transition text-white py-2 px-4 rounded w-full mt-4";
    saveButton.textContent = "Save";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "bg-gray-300 text-black py-2 px-4 rounded w-full mt-4 hover:bg-gray-400 transition";
    cancelButton.textContent = "Cancel";

    form.append(titleInput, deadlineInput, imagesTextarea, descriptionTextarea, saveButton, cancelButton);
    modalContent.append(modalTitle, form);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    cancelButton.addEventListener("click", () => {
        modalOverlay.classList.add("hidden");
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            alert("You must be logged in to create a post.");
            return;
        }

        const title = titleInput.value.trim();
        const deadline = deadlineInput.value;
        const imagesRaw = imagesTextarea.value.trim();
        const description = descriptionTextarea.value.trim();

        if (!title || !deadline || !imagesRaw || !description) {
            alert("Please fill in all fields.");
            return;
        }

        const media = imagesRaw
            .split("\n")
            .map((url) => url.trim())
            .filter((url) => url.length > 0 && url.startsWith("http"))
            .map((url, index) => ({
                url,
                alt: `Image ${index + 1} for ${title}`
            }));

        const listingData = {
            title,
            description,
            media,
            endsAt: new Date(deadline).toISOString(),
        };

        try {
            await createPost(accessToken, listingData);
            modalOverlay.classList.add("hidden");
            location.reload();
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Something went wrong when creating the post.");
        }
    });
}

