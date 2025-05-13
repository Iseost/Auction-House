import { API_AUCTION_PROFILES, API_KEY } from "../constants.mjs";

const accessToken = localStorage.getItem("accessToken");
const username = localStorage.getItem("username");

export function showEditProfileModal() {
    // Create modal overlay
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "editProfileModal";
    modalOverlay.className = "fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"; // Added backdrop-filter

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.className = "bg-white p-6 rounded-lg shadow-lg w-full max-w-xl";

    // Create modal title
    const modalTitle = document.createElement("h2");
    modalTitle.className = "text-2xl font-bold font-['Playfair_Display'] text-center mb-6";
    modalTitle.textContent = "Edit Your Profile";

    // Create form
    const form = document.createElement("form");
    form.id = "editProfileForm";
    form.classList.add("flex", "flex-col", "items-start", "w-full", "space-y-4");

    // Name input
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "edit_name";
    nameInput.placeholder = "Your name";
    nameInput.className = "w-full border border-gray-300 rounded px-4 py-2";
    nameInput.required = true;

    // Avatar input
    const avatarInput = document.createElement("input");
    avatarInput.type = "url";
    avatarInput.id = "edit_avatar";
    avatarInput.placeholder = "Enter Avatar URL";
    avatarInput.className = "w-full border border-gray-300 rounded px-4 py-2";

    // Banner input
    const bannerInput = document.createElement("input");
    bannerInput.type = "url";
    bannerInput.id = "edit_banner";
    bannerInput.placeholder = "Enter Banner URL";
    bannerInput.className = "w-full border border-gray-300 rounded px-4 py-2";

    // Save button
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.id = "save_edit";
    saveButton.className = "bg-Blue_Chill hover:bg-Blue_Chill/80 transition text-white py-2 px-4 rounded w-full mt-4";
    saveButton.textContent = "Save Changes";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.id = "cancel_edit";
    cancelButton.className = "bg-gray-500 hover:bg-gray-600 transition text-white py-2 px-4 rounded w-full mt-4";
    cancelButton.textContent = "Cancel";

    form.append(nameInput, avatarInput, bannerInput, saveButton, cancelButton);
    modalContent.append(modalTitle, form);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    cancelButton.addEventListener("click", () => {
        modalOverlay.classList.add("hidden");
    });

    saveButton.addEventListener("click", async () => {
        const avatarUrl = avatarInput.value.trim();
        const bannerUrl = bannerInput.value.trim();

        const profileUpdate = {};

        if (avatarUrl) {
            profileUpdate.avatar = {
                url: avatarUrl,
                alt: "User avatar",
            };
        }

        if (bannerUrl) {
            profileUpdate.banner = {
                url: bannerUrl,
                alt: "User banner",
            };
        }

        if (!profileUpdate.avatar && !profileUpdate.banner) {
            alert("You must provide at least one field to update (avatar or banner).");
            return;
        }

        try {
            const response = await fetch(`${API_AUCTION_PROFILES}/${username}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    "X-Noroff-API-Key": API_KEY,
                },
                body: JSON.stringify(profileUpdate),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to update profile:", errorData);
                alert("Something went wrong. Make sure image URLs are publicly accessible.");
                return;
            }

            alert("Profile updated successfully!");
            window.location.href = `/profile/profile.html?username=${username}`;
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating your profile.");
        }
    });
}

