import { getProfile } from "../api/profile.mjs";
import { showCreatePostModal } from "../postActions/create.mjs";
import { getSinglePost } from "../api/singlePost.mjs";

function applyTailwindClasses(element, classNames) {
    element.classList.add(...classNames.split(" "));
}

const accessToken = localStorage.getItem("accessToken");
const username = localStorage.getItem("username");

// Display credits globally if logged in
function displayGlobalCredits() {
    if (!accessToken || !username) return;

    const creditsBar = document.createElement("div");
    creditsBar.id = "credits_bar";
    document.body.insertAdjacentElement("afterbegin", creditsBar);
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

        // Banner
        const bannerContainer = document.createElement("div");
        applyTailwindClasses(bannerContainer, "banner_container w-full");

        const bannerImg = document.createElement("img");
        applyTailwindClasses(bannerImg, "banner_img w-full h-48 object-cover");
        bannerImg.src = profile.data.banner?.url || "default-banner.jpg";
        bannerImg.alt = profile.data.banner?.alt || "User banner";

        bannerContainer.appendChild(bannerImg);

        // Profile card
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

        // Buttons
        const buttonContainer = document.createElement("div");
        applyTailwindClasses(buttonContainer, "button_container flex gap-2 my-4 ml-8");

        const editButton = document.createElement("button");
        applyTailwindClasses(editButton, "edit_button bg-Blue_Chill text-white text-sm px-3 py-1 rounded");
        editButton.innerText = "Edit Profile";
        editButton.addEventListener("click", () => {
            window.location.href = "../profile/edit.html";
        });

        const createButton = document.createElement("button");
        applyTailwindClasses(createButton, "create_button bg-Blue_Chill text-white text-sm px-3 py-1 rounded");
        createButton.innerText = "Create Post";
        createButton.addEventListener("click", showCreatePostModal);

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(createButton);

        // Post container
        const postContainer = document.createElement("div");
        postContainer.id = "post_container";
        postContainer.className = "grid";

        // Append everything
        main.appendChild(bannerContainer);
        main.appendChild(cardProfile);
        main.appendChild(buttonContainer);
        main.appendChild(postContainer);
    } catch (error) {
        console.error("Error displaying profile:", error);
    }
}

async function displaySinglePost() {
    try {
        // Get postId from URL
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const postId = urlParams.get("postId"); // Retrieve postId from the URL

        if (!postId) {
            console.error("Post ID is missing in the URL.");
            return;
        }

        // Fetch single post data using the postId
        const singlePost = await getSinglePost(accessToken, postId);
        const content = document.getElementById("post_container");

        if (!singlePost || singlePost.data.length === 0) {
            content.innerHTML = "<p>No posts to display</p>";
            return;
        }

        singlePost.data.forEach((post) => {
            // Card container
            const card = document.createElement("div");
            applyTailwindClasses(card, "flex flex-col m-4 p-4 rounded-lg bg-white cursor-pointer max-w-2xl border border-gray-300");

            // Post image
            const img = document.createElement("img");
            img.src = post.media?.url || "./src/assets/image.png"; // Fallback image if no coverImage is provided
            applyTailwindClasses(img, "w-full h-auto rounded-md");
            img.alt = "Post Image";

            // Title
            const title = document.createElement("h2");
            title.textContent = post.title;
            applyTailwindClasses(title, "text-2xl font-semibold mt-4");

            // Post body
            const body = document.createElement("p");
            body.textContent = post.body;
            applyTailwindClasses(body, "text-gray-600 mt-2 text-sm");

            // Bid button
            const bidButton = document.createElement("button");
            bidButton.textContent = "Place Bid";
            applyTailwindClasses(bidButton, "bg-Heliotrope text-white px-4 py-2 rounded mt-4");
            bidButton.addEventListener("click", () => {
                console.log(`Bid clicked for post ID ${post.id}`);
            });

            // Bid history container
            const bidHistoryContainer = document.createElement("div");
            applyTailwindClasses(bidHistoryContainer, "mt-4");

            const bidHistoryTitle = document.createElement("h3");
            bidHistoryTitle.textContent = "Bidding History";
            applyTailwindClasses(bidHistoryTitle, "text-lg font-semibold");

            const bidList = document.createElement("ul");
            if (post.bids && post.bids.length > 0) {
                post.bids.forEach((bid) => {
                    const bidItem = document.createElement("li");
                    bidItem.textContent = `User: ${bid.bidderName || 'Anonymous'}, Amount: ${bid.amount}`;
                    applyTailwindClasses(bidItem, "mt-2 text-sm text-gray-700");
                    bidList.appendChild(bidItem);
                });
            } else {
                const noBids = document.createElement("p");
                noBids.textContent = "No bids yet.";
                applyTailwindClasses(noBids, "mt-2 text-sm text-gray-600");
                bidHistoryContainer.appendChild(noBids);
            }

            // Append everything to the card
            bidHistoryContainer.appendChild(bidHistoryTitle);
            bidHistoryContainer.appendChild(bidList);
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(body);
            card.appendChild(bidButton);
            card.appendChild(bidHistoryContainer);

            // Append the card to the content
            content.appendChild(card);
        });
    } catch (error) {
        console.error("Error displaying single post:", error);
    }
}

// Call the display function to show the single post based on the postId in the URL
displaySinglePost();
displayGlobalCredits();
await displayProfile();
