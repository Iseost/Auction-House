import { getProfile } from "../api/profile.mjs";
import { showEditProfileModal } from "../postActions/edit.mjs";
import { showCreatePostModal } from "../postActions/create.mjs";
import { getUserPosts } from "../api/userPosts.mjs";
import { formatDate, auctionTimeLeft } from "../components/timer.mjs";

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
                // Endret klassene her for å matche de fra userPost.mjs
                applyTailwindClasses(card, "flex flex-col m-4 p-4 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 shadow-md transition-all duration-300 transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer max-w-sm overflow-hidden");

                const header = document.createElement("div");
                applyTailwindClasses(header, "flex justify-between items-center mb-2");

                const profile = document.createElement("div");
                applyTailwindClasses(profile, "flex items-center gap-2");

                const avatarImg = document.createElement("img");
                avatarImg.src = post.seller.avatar?.url || "./src/assets/image.png";
                avatarImg.alt = post.seller.avatar?.alt || `${post.seller.name || "User"}'s avatar`;
                avatarImg.addEventListener("click", () => {
                    // Hvis posten tilhører den innloggede brukeren, naviger til profil-siden i stedet
                    if (post.seller.name === username) {
                        window.location.href = `/profile/userProfile.html?username=${username}`;
                    } else {
                        window.location.href = `../profile/userProfile.html?username=${post.seller.name || "Unknown"}`;
                    }
                });
                avatarImg.style.cursor = "pointer";
                avatarImg.onerror = () => {
                    avatarImg.src = "./src/assets/image.png";
                };
                applyTailwindClasses(avatarImg, "w-8 h-8 rounded-full object-cover");

                const name = document.createElement("span");
                name.innerText = post.seller.name || "Unknown";
                name.addEventListener("click", () => {
                    window.location.href = `/`;
                });
                name.style.cursor = "pointer";
                applyTailwindClasses(name, "text-sm font-medium text-gray-800");

                profile.append(avatarImg, name);

                const createdDate = document.createElement("span");
                createdDate.innerText = `Created: ${formatDate(post.created)}`;
                applyTailwindClasses(createdDate, "text-xs text-gray-500");

                header.append(profile, createdDate);

                const imageContainer = document.createElement("div");
                applyTailwindClasses(imageContainer, "flex items-center justify-center w-full max-h-[200px] sm:max-h-[240px] h-full cursor-pointer overflow-hidden drop-shadow-darkFaded");

                const postImage = document.createElement("img");
                postImage.src = post.media?.[0]?.url || "./src/assets/image.png";
                postImage.alt = "Post Image";
                applyTailwindClasses(postImage, "object-cover w-full h-full hover:scale-110 transition-transform duration-300");
                postImage.addEventListener("click", () => {
                    window.location.href = `../feed/post.html?postId=${post.id}`;
                });

                imageContainer.appendChild(postImage);

                const title = document.createElement("h2");
                title.innerText = post.title;
                applyTailwindClasses(title, "text-xl font-semibold mt-4 line-clamp-1");

                const description = document.createElement("p");
                description.innerText = post.description;
                applyTailwindClasses(description, "text-gray-600 mt-2 text-sm line-clamp-2 border-b border-darkFaded dark:border-whiteFaded pb-2");

                const endsAt = document.createElement("p");
                endsAt.innerText = `Ends: ${formatDate(post.endsAt)}`;
                applyTailwindClasses(endsAt, "text-xs text-gray-500 mt-1 border-b border-darkFaded");

                const timer = auctionTimeLeft(post.endsAt);
                applyTailwindClasses(timer, "text-sm text-red-600 mt-2");

                card.append(header, imageContainer, title, description, endsAt, timer);

                if (post.seller.name === username) {
                    const updateBtn = document.createElement("button");
                    updateBtn.innerText = "Update";
                    applyTailwindClasses(updateBtn, "bg-Blue_Chill text-white px-4 py-2 rounded hover:opacity-90 transition-opacity duration-200");
                    updateBtn.addEventListener("click", () => {
                        window.location.href = `/postActions/updateListing.html?id=${post.id}`;
                    });

                    const viewBidsBtn = document.createElement("button");
                    viewBidsBtn.innerText = "View Bids";
                    applyTailwindClasses(viewBidsBtn, "bg-allports hover:bg-hover_allports text-white px-4 py-2 rounded");

                    const sellerButtonsContainer = document.createElement("div");
                    applyTailwindClasses(sellerButtonsContainer, "flex gap-3 mt-3");

                    sellerButtonsContainer.appendChild(updateBtn);
                    sellerButtonsContainer.appendChild(viewBidsBtn);
                    card.appendChild(sellerButtonsContainer);

                    const modalContainer = document.createElement("div");
                    modalContainer.style.display = "none";
                    applyTailwindClasses(modalContainer, "fixed inset-0 bg-opacity-50 flex justify-center items-center backdrop-blur-lg z-50");

                    const modalContent = document.createElement("div");
                    applyTailwindClasses(modalContent, "bg-white p-6 rounded-lg shadow-lg w-80");

                    const modalHeader = document.createElement("h2");
                    modalHeader.textContent = "Bidder List";
                    applyTailwindClasses(modalHeader, "text-xl font-semibold mb-4");

                    const modalList = document.createElement("ul");
                    applyTailwindClasses(modalList, "space-y-2");

                    const closeModalBtn = document.createElement("button");
                    closeModalBtn.textContent = "Close";
                    applyTailwindClasses(closeModalBtn, "mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded");

                    closeModalBtn.addEventListener("click", () => {
                        modalContainer.style.display = "none";
                        viewBidsBtn.textContent = "View Bids";
                    });

                    modalContent.appendChild(modalHeader);
                    modalContent.appendChild(modalList);
                    modalContent.appendChild(closeModalBtn);
                    modalContainer.appendChild(modalContent);
                    document.body.appendChild(modalContainer);

                    viewBidsBtn.addEventListener("click", () => {
                        if (modalContainer.style.display === "none") {
                            modalList.innerHTML = "";
                            post.bids?.forEach(bid => {
                                const listItem = document.createElement("li");
                                applyTailwindClasses(listItem, "flex items-center justify-between bg-gray-100 p-3 rounded-lg");

                                const profile = document.createElement("div");
                                applyTailwindClasses(profile, "flex items-center gap-3");

                                const avatar = document.createElement("img");
                                avatar.src = bid.bidder?.avatar?.url || "https://placehold.co/40x40";
                                avatar.alt = bid.bidder?.name;
                                applyTailwindClasses(avatar, "w-10 h-10 rounded-full object-cover");

                                const name = document.createElement("span");
                                name.textContent = bid.bidder?.name || "Unknown";
                                applyTailwindClasses(name, "font-medium");

                                profile.appendChild(avatar);
                                profile.appendChild(name);

                                const amount = document.createElement("span");
                                amount.textContent = bid.amount;
                                applyTailwindClasses(amount, "font-semibold text-gray-800");

                                listItem.appendChild(profile);
                                listItem.appendChild(amount);
                                modalList.appendChild(listItem);
                            });

                            modalContainer.style.display = "flex";
                            viewBidsBtn.textContent = "Hide Bids";
                        } else {
                            modalContainer.style.display = "none";
                            viewBidsBtn.textContent = "View Bids";
                        }
                    });
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
            editButton.innerText = "Edit your Profile";
            applyTailwindClasses(editButton, "bg-Blue_Chill text-white text-sm px-3 py-1 rounded");
            editButton.addEventListener("click", showEditProfileModal);

            const createButton = document.createElement("button");
            createButton.innerText = "Create a new listing";
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
