import { getSinglePost } from "../api/singlePost.mjs";

async function displaySinglePost(postId) {
    try {
        const content = document.getElementById("singlepost_container");
        const accessToken = localStorage.getItem("accessToken");

        const post = await getSinglePost(accessToken, postId);

        const card = document.createElement("div");
        card.className = "card flex";
        card.dataset.postId = post.id;

        const img = document.createElement("img");
        img.src = post.media?.url || "fallback.jpg";
        img.className = "cover";
        img.alt = "post image";

        const title = document.createElement("h2");
        title.className = "cover_text";
        title.textContent = post.title;

        const body = document.createElement("p");
        body.className = "cover_small_text";
        body.textContent = post.body;

        const bidButton = document.createElement("button");
        bidButton.className = "bid-button";
        bidButton.textContent = "Place Bid";
        bidButton.addEventListener("click", () => {
            console.log(`Bid clicked for post ID ${post.id}`);
        });

        const bidHistoryContainer = document.createElement("div");
        bidHistoryContainer.className = "bid-history";

        const bidHistoryTitle = document.createElement("h3");
        bidHistoryTitle.textContent = "Bidding History";

        const bidList = document.createElement("ul");

        if (post.bids && post.bids.length > 0) {
            post.bids.forEach((bid) => {
                const bidItem = document.createElement("li");
                bidItem.textContent = `User: ${bid.bidderName || 'Anonymous'}, Amount: ${bid.amount}`;
                bidList.appendChild(bidItem);
            });
        } else {
            const noBids = document.createElement("p");
            noBids.textContent = "No bids yet.";
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

// Hent postId fra URL
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

if (postId) {
    displaySinglePost(postId);
} else {
    console.error("Missing post ID in URL.");
}
