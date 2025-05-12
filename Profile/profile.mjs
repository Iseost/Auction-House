import { getProfile } from "../api/profile.mjs";
import { showCreatePostModal } from "../postActions/create.mjs";
import { getUserPosts } from "../api/userPosts.mjs";


const accessToken = localStorage.getItem("accessToken");
const username = localStorage.getItem("username");

function applyTailwindClasses(element, classNames) {
    element.classList.add(...classNames.split(" "));
}

export function displayGlobalCredits() {
    if (!accessToken || !username) return;

    const creditsBar = document.createElement("div");
    creditsBar.id = "credits_bar";
    document.body.insertAdjacentElement("afterbegin", creditsBar);
}

async function displayUserPosts(usernameParam, accessToken) {
    const postContainer = document.createElement("div");
    postContainer.id = "post_container";
    postContainer.className = "grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4";

    try {
        const posts = await getUserPosts(usernameParam, accessToken);

        if (posts && posts.length > 0) {
            posts.forEach((post) => {
                const card = document.createElement("div");
                card.className = "flex flex-col justify-between p-4 bg-white rounded shadow h-full";

                const contentWrapper = document.createElement("div");
                contentWrapper.className = "flex-grow";

                const img = document.createElement("img");
                img.src = post.media?.[0]?.url || "default-post.jpg";
                img.alt = post.media?.[0]?.alt || "Post image";
                img.className = "w-full rounded mb-2";

                const title = document.createElement("h2");
                title.textContent = post.title;
                applyTailwindClasses(title, "text-xl font-semibold");

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

                contentWrapper.append(img, title, description, createdAt, updatedAt, endsAt, bids);
                card.appendChild(contentWrapper);

                if (post.seller.name === username) {
                    const buttonWrapper = document.createElement("div");
                    buttonWrapper.className = "flex justify-end mt-4";

                    const editBtn = document.createElement("button");
                    editBtn.textContent = "Update";
                    editBtn.className = "bg-Blue_Chill text-white px-3 py-1 text-sm rounded hover:bg-blue-700";
                    editBtn.addEventListener("click", () => {
                        window.location.href = `/postActions/updateListing.html?id=${post.id}`;
                    });

                    buttonWrapper.appendChild(editBtn);
                    card.appendChild(buttonWrapper);
                }

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
        applyTailwindClasses(bannerContainer, "w-full");

        const bannerImg = document.createElement("img");
        bannerImg.src = profile.data.banner?.url || "default-banner.jpg";
        bannerImg.alt = profile.data.banner?.alt || "User banner";
        applyTailwindClasses(bannerImg, "w-full h-48 object-cover");

        bannerContainer.appendChild(bannerImg);

        const cardProfile = document.createElement("div");
        applyTailwindClasses(cardProfile, "flex items-center m-8");

        const profileImg = document.createElement("img");
        profileImg.src = profile.data.avatar?.url || "default-avatar.jpg";
        profileImg.alt = profile.data.avatar?.alt || "User avatar";
        applyTailwindClasses(profileImg, "rounded-full w-32 h-32 mr-6");

        const profileInfo = document.createElement("div");

        const nameHeading = document.createElement("h1");
        nameHeading.textContent = profile.data.name;
        applyTailwindClasses(nameHeading, "text-2xl font-bold");

        const creditsParagraph = document.createElement("p");
        creditsParagraph.innerHTML = `<strong>Credits:</strong> ${profile.data.credits}`;

        profileInfo.append(nameHeading, creditsParagraph);
        cardProfile.append(profileImg, profileInfo);

        const buttonContainer = document.createElement("div");
        applyTailwindClasses(buttonContainer, "flex gap-2 my-4 ml-8");

        if (usernameParam === username) {
            const editButton = document.createElement("button");
            editButton.innerText = "Edit Profile";
            applyTailwindClasses(editButton, "bg-Blue_Chill text-white text-sm px-3 py-1 rounded");
            editButton.addEventListener("click", () => {
                window.location.href = "../postActions/edit.html";
            });

            const createButton = document.createElement("button");
            createButton.innerText = "Create Post";
            applyTailwindClasses(createButton, "bg-Blue_Chill text-white text-sm px-3 py-1 rounded");
            createButton.addEventListener("click", showCreatePostModal);

            buttonContainer.append(editButton, createButton);
        }

        main.append(bannerContainer, cardProfile, buttonContainer);

        await displayUserPosts(usernameParam, accessToken);
    } catch (error) {
        console.error("Error displaying profile:", error);
    }
}

displayGlobalCredits();
await displayProfile();
