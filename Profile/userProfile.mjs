import { getUserListings } from "../api/user.js";
import { createPostBox } from "../feed/feed.mjs";

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username");

const bannerEl = document.querySelector(".profile-banner");
const avatarEl = document.querySelector(".profile-avatar");
const nameEl = document.querySelector(".profile-name");
const postContainer = document.getElementById("post_container");

async function loadUserProfile(username) {
    try {
        const userData = await getUserListings(username);

        const user = userData[0]?.seller;
        if (user) {
            bannerEl.style.backgroundImage = `url(${user.banner || "https://placehold.co/1200x300?text=Banner"})`;
            avatarEl.src = user.avatar || "https://placehold.co/100x100?text=Avatar";
            nameEl.textContent = user.name || "User";
        }

        postContainer.innerHTML = "";
        userData.forEach((post) => {
            createPostBox(
                post.media?.[0]?.url,
                post.title,
                post.description,
                post.id,
                post.endsAt,
                post.seller?.avatar,
                post.seller?.name,
                post.created
            );
        });
    } catch (error) {
        console.error("Error loading user profile:", error);
        postContainer.innerHTML = "<p>Something went wrong loading the user's post.</p>";
    }
}

loadUserProfile(username);
