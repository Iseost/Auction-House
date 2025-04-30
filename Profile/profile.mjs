import { getProfile } from "../api/profile.mjs";
import { getSinglePost } from "../api/singlePost.mjs";
import { deletePost } from "../api/postActions.mjs";

const accessToken = localStorage.getItem("accessToken");
const username = localStorage.getItem("username"); // assuming you store username on login

// Display credits globally if logged in
function displayGlobalCredits() {
    if (!accessToken || !username) return;

    const creditsBar = document.createElement("div");
    creditsBar.id = "credits_bar";
    document.body.insertAdjacentElement("afterbegin", creditsBar); // show at top of page

    getProfile(accessToken, username)
        .then(profile => {
            creditsBar.innerHTML = `
                <div class="credits_global">💰 Credits: <strong>${profile.data.credits}</strong></div>
            `;
        })
        .catch(error => console.error("Failed to fetch credits:", error));
}

// Display profile page
async function displayProfile() {
    try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const usernameParam = urlParams.get("username");
        const profile = await getProfile(accessToken, usernameParam);

        if (!profile) return;

        const main = document.querySelector("main");

        main.innerHTML = `
            <div class="banner_container">
                <img class="banner_img" src="${profile.data.banner?.url || 'default-banner.jpg'}" alt="${profile.data.banner?.alt || 'User banner'}">
            </div>
            <div class="card_profile flex">
                <img class="profile_img" src="${profile.data.avatar?.url || 'default-avatar.jpg'}" alt="${profile.data.avatar?.alt || 'User avatar'}">
                <div class="profile_info">
                    <h1>${profile.data.name}</h1>
                    <p><strong>Credits:</strong> ${profile.data.credits}</p>
                </div>
            </div>
            <div class="button_container"></div>
            <div id="post_container" class="grid"></div>
        `;

        createButtons();
        await displayPosts(usernameParam);
    } catch (error) {
        console.error("Error displaying profile:", error);
    }
}

// Add create/edit buttons
function createButtons() {
    const buttonContainer = document.querySelector(".button_container");

    const buttons = [
        { text: "Edit Profile", url: "../profile/edit.html" },
        { text: "Create Post", url: "../postActions/create.html" },
        { text: "Edit Post", url: "../postActions/edit.html" },
    ];

    buttons.forEach(({ text, url }) => {
        const button = document.createElement("button");
        button.classList.add("button_color");
        button.innerText = text;
        button.addEventListener("click", () => (window.location.href = url));
        buttonContainer.appendChild(button);
    });
}

// Display posts by user
async function displayPosts(username) {
    try {
        const singlePost = await getSinglePost(accessToken, username);
        const content = document.getElementById("post_container");

        if (!singlePost.data.length) {
            content.innerHTML = "<p>No posts to display</p>";
            return;
        }

        content.innerHTML = singlePost.data.map(post => `
            <div class="card flex" data-post-id="${post.id}">
                <img src="${post.media?.url}" class="cover" alt="post image">
                <h2 class="cover_text">${post.title}</h2>
                <p class="cover_small_text">${post.body}</p>

                <div class="actions">
                    <button class="reaction_button">❤️</button>
                    <p class="reaction_count">Reactions: ${post.reactions?.length || 0}</p>
                </div>

                <div class="comments_section">
                    ${post.comments?.map(comment => `<p>${comment}</p>`).join('')}
                    <textarea class="comment_box" placeholder="Add a comment..."></textarea>
                    <button class="comment_button">Post Comment</button>
                </div>

                <button class="delete_button">Delete Post</button>
            </div>
        `).join("");

        addPostEventListeners();
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Handle reactions, comments, and delete
function addPostEventListeners() {
    const reactionButtons = document.querySelectorAll(".reaction_button");
    const commentButtons = document.querySelectorAll(".comment_button");
    const deleteButtons = document.querySelectorAll(".delete_button");

    reactionButtons.forEach(button => {
        button.addEventListener("click", () => {
            const postElement = button.closest(".card");
            const reactionCount = postElement.querySelector(".reaction_count");
            const currentCount = parseInt(reactionCount.textContent.split(": ")[1]);
            reactionCount.textContent = `Reactions: ${currentCount + 1}`;
            alert("Reaction added!");
        });
    });

    commentButtons.forEach(button => {
        button.addEventListener("click", () => {
            const commentBox = button.previousElementSibling;
            if (commentBox.value) {
                const commentsSection = button.closest(".comments_section");
                const newComment = document.createElement("p");
                newComment.textContent = commentBox.value;
                commentsSection.appendChild(newComment);
                commentBox.value = "";
                alert("Comment posted!");
            }
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const postElement = button.closest(".card");
            const postId = postElement.dataset.postId;
            await deletePost(accessToken, postId);
            postElement.remove();
        });
    });
}

// Initialize
displayGlobalCredits();
await displayProfile();
