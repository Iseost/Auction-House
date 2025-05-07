import { getSinglePost } from "../api/singlePost.mjs";

import { applyTailwindClasses } from "../utils/tailwind.mjs";
async function displaySinglePost() {
    try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const postId = urlParams.get("postId");

        if (!postId) {
            console.error("Post ID is missing in the URL.");
            return;
        }

        const accessToken = "your_access_token_here"; // Replace with actual token or fetch dynamically
        const post = await getSinglePost(accessToken, postId);
        const content = document.getElementById("post_container");

        if (!post) {
            content.innerHTML = "<p>No post to display</p>";
            return;
        }

        // Card container
        const card = document.createElement("div");
        applyTailwindClasses(card, "flex flex-col m-4 p-4 rounded-lg bg-white cursor-pointer max-w-2xl border border-gray-300");

        const img = document.createElement("img");
        img.src = post.media?.url || "./src/assets/image.png";
        applyTailwindClasses(img, "w-full h-auto rounded-md");
        img.alt = "Post Image";

        const title = document.createElement("h2");
        title.textContent = post.title;
        applyTailwindClasses(title, "text-2xl font-semibold mt-4");

        const body = document.createElement("p");
        body.textContent = post.body;
        applyTailwindClasses(body, "text-gray-600 mt-2 text-sm");

        const bidButton = document.createElement("button");
        bidButton.textContent = "Place Bid";
        applyTailwindClasses(bidButton, "bg-Heliotrope text-white px-4 py-2 rounded mt-4");
        bidButton.addEventListener("click", () => {
            console.log(`Bid clicked for post ID ${post.id}`);
        });

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

        bidHistoryContainer.appendChild(bidHistoryTitle);
        bidHistoryContainer.appendChild(bidList);
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(body);
        card.appendChild(bidButton);
        card.appendChild(bidHistoryContainer);

        content.appendChild(card);
    } catch (error) {
        console.error("Error displaying single post:", error);
    }
}

displaySinglePost();