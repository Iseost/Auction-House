import { getProfile } from "../api/profile.mjs";
import { showCreatePostModal } from "../postActions/create.mjs";
import { getUserPosts } from "../api/userPosts.mjs";

// Retrieve user data from localStorage
const accessToken = localStorage.getItem("accessToken");
const username = localStorage.getItem("username");

function applyTailwindClasses(element, classNames) {
    element.classList.add(...classNames.split(" "));
}

function displayGlobalCredits() {
    if (!accessToken || !username) return;

    const creditsBar = document.createElement("div");
    creditsBar.id = "credits_bar";
    document.body.insertAdjacentElement("afterbegin", creditsBar);
}

async function displayUserPosts(username, accessToken) {
    const postContainer = document.createElement("div");
    postContainer.id = "post_container";
    postContainer.className = "grid";

    try {
        const posts = await getUserPosts(username, accessToken);

        if (posts && posts.length > 0) {
            posts.forEach((post) => {
                const card = document.createElement("div");
                card.classList.add(
                    "card", "p-4", "m-4", "bg-white", "rounded", "shadow",
                    "flex", "flex-col", "justify-between", "h-full"
                );

                const contentWrapper = document.createElement("div");
                contentWrapper.className = "flex flex-col flex-grow";

                const img = document.createElement("img");
                img.classList.add("card_img", "w-full", "rounded");
                img.src = post.media?.[0]?.url || "default-post.jpg";
                img.alt = post.media?.[0]?.alt || "Post image";

                const title = document.createElement("h2");
                title.textContent = post.title;
                applyTailwindClasses(title, "text-xl font-semibold mt-2");

                const description = document.createElement("p");
                description.textContent = post.description;
                applyTailwindClasses(description, "text-gray-600 mt-1");

                const createdAt = document.createElement("p");
                createdAt.textContent = `Created: ${new Date(post.created).toLocaleString()}`;
                applyTailwindClasses(createdAt, "text-xs text-gray-500 mt-2");

                const updatedAt = document.createElement("p");
                updatedAt.textContent = `Updated: ${new Date(post.updated).toLocaleString()}`;
                applyTailwindClasses(updatedAt, "text-xs text-gray-500");

                const endsAt = document.createElement("p");
                endsAt.textContent = `Ends at: ${new Date(post.endsAt).toLocaleString()}`;
                applyTailwindClasses(endsAt, "text-xs text-red-500 font-medium");

                const bids = document.createElement("p");
                bids.textContent = `Bids: ${post._count?.bids || 0}`;
                applyTailwindClasses(bids, "text-sm font-semibold text-blue-800 mt-2");

                // Append content
                contentWrapper.appendChild(img);
                contentWrapper.appendChild(title);
                contentWrapper.appendChild(description);
                contentWrapper.appendChild(createdAt);
                contentWrapper.appendChild(updatedAt);
                contentWrapper.appendChild(endsAt);
                contentWrapper.appendChild(bids);

                // 👇 Only show if logged-in user is the seller
                if (post.seller.name === username) {
                    const buttonWrapper = document.createElement("div");
                    buttonWrapper.className = "flex justify-end mt-auto pt-4";

                    const editBtn = document.createElement("button");
                    editBtn.textContent = "Update";
                    editBtn.className = "bg-Blue_Chill text-white px-3 py-1 text-sm rounded hover:bg-blue-700";
                    editBtn.addEventListener("click", () => {
                        window.location.href = `/postActions/updateListing.html?id=${post.id}`;
                    });

                    buttonWrapper.appendChild(editBtn);
                    contentWrapper.appendChild(buttonWrapper);
                }

                card.appendChild(contentWrapper);
                postContainer.appendChild(card);
            });
        } else {
            const noPosts = document.createElement("p");
            noPosts.textContent = "No posts to display.";
            applyTailwindClasses(noPosts, "text-gray-500 text-sm m-4");
            postContainer.appendChild(noPosts);
        }

        const main = document.querySelector("main");
        main.appendChild(postContainer);
    } catch (error) {
        console.error("Error fetching user posts:", error);
    }
}

async function displayProfile() {
    try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const usernameParam = urlParams.get("username");

        const profile = await getProfile(accessToken, usernameParam);
        if (!profile) return;

        const main = document.querySelector("main");

        const bannerContainer = document.createElement("div");
        applyTailwindClasses(bannerContainer, "banner_container w-full");

        const bannerImg = document.createElement("img");
        applyTailwindClasses(bannerImg, "banner_img w-full h-48 object-cover");
        bannerImg.src = profile.data.banner?.url || "default-banner.jpg";
        bannerImg.alt = profile.data.banner?.alt || "User banner";

        bannerContainer.appendChild(bannerImg);

        const cardProfile = document.createElement("div");
        applyTailwindClasses(cardProfile, "card_profile flex items-center m-8");

        const profileImg = document.createElement("img");
        applyTailwindClasses(profileImg, "profile_img rounded-full w-32 h-32 mr-6");
        profileImg.src = profile.data.avatar?.url || "default-avatar.jpg";
        profileImg.alt = profile.data.avatar?.alt || "User avatar";

        const profileInfo = document.createElement("div");
        profileInfo.className = "profile_info";

        const nameHeading = document.createElement("h1");
        applyTailwindClasses(nameHeading, "name_heading flex justify-center text-2xl font-bold");
        nameHeading.textContent = profile.data.name;

        const creditsParagraph = document.createElement("p");
        creditsParagraph.innerHTML = `<strong>Credits:</strong> ${profile.data.credits}`;

        profileInfo.appendChild(nameHeading);
        profileInfo.appendChild(creditsParagraph);

        cardProfile.appendChild(profileImg);
        cardProfile.appendChild(profileInfo);

        const buttonContainer = document.createElement("div");
        applyTailwindClasses(buttonContainer, "button_container flex gap-2 my-4 ml-8");

        if (usernameParam === username) {
            const editButton = document.createElement("button");
            applyTailwindClasses(editButton, "edit_button bg-Blue_Chill text-white text-sm px-3 py-1 rounded");
            editButton.innerText = "Edit Profile";
            editButton.addEventListener("click", () => {
                window.location.href = "../postActions/edit.html";
            });

            const createButton = document.createElement("button");
            applyTailwindClasses(createButton, "create_button bg-Blue_Chill text-white text-sm px-3 py-1 rounded");
            createButton.innerText = "Create Post";
            createButton.addEventListener("click", showCreatePostModal);

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(createButton);
        }

        main.appendChild(bannerContainer);
        main.appendChild(cardProfile);
        main.appendChild(buttonContainer);

        // Show user posts
        await displayUserPosts(usernameParam, accessToken);
    } catch (error) {
        console.error("Error displaying profile:", error);
    }
}

displayGlobalCredits();
await displayProfile();
