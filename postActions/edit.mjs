import { API_AUCTION_PROFILES, API_KEY } from "../constants.mjs";

const accessToken = localStorage.getItem("accessToken");
const username = localStorage.getItem("username");

const saveBtn = document.getElementById("save_edit");

saveBtn.addEventListener("click", async () => {
    const avatarUrl = document.getElementById("edit_avatar").value.trim();
    const bannerUrl = document.getElementById("edit_banner").value.trim();

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
