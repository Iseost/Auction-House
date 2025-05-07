import { getSinglePost } from "../api/singlePost.mjs";


function applyTailwindClasses(element, classes) {
    element.className = classes;
}
async function displaySinglePost() {
    try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const postId = urlParams.get("postId");

        if (!postId) {
            console.error("Post ID is missing in the URL.");
            return;
        }

        const accessToken = localStorage.getItem("accessToken");
        const post = await getSinglePost(accessToken, postId);
        const content = document.getElementById("post_container");

        if (!post) {
            content.innerHTML = "<p>No post to display</p>";
            return;
        }

        const card = document.createElement("div");
        applyTailwindClasses(card, "flex flex-col m-4 p-4 rounded-lg bg-white cursor-pointer max-w-2xl border border-gray-300");

        // Media (image)
        const img = document.createElement("img");
        img.src = post.media?.[0]?.url || "../src/assets/image.png";
        img.alt = post.media?.[0]?.alt || "Post Image";
        applyTailwindClasses(img, "w-full h-auto rounded-md");

        // Title
        const title = document.createElement("h2");
        title.textContent = post.title;
        applyTailwindClasses(title, "text-2xl font-semibold mt-4");

        // Description/body
        const description = document.createElement("p");
        description.textContent = post.description || post.body || "No description available.";
        applyTailwindClasses(description, "text-gray-600 mt-2 text-sm");

        // Tags
        const tags = document.createElement("p");
        tags.textContent = post.tags && post.tags.length > 0 ? `Tags: ${post.tags.join(", ")}` : "No tags";
        applyTailwindClasses(tags, "text-sm text-gray-500 mt-2");

        // Created date
        const created = document.createElement("p");
        created.textContent = `Created: ${new Date(post.created).toLocaleString()}`;
        applyTailwindClasses(created, "text-sm text-gray-500 mt-2");

        // Updated date
        const updated = document.createElement("p");
        updated.textContent = `Last updated: ${new Date(post.updated).toLocaleString()}`;
        applyTailwindClasses(updated, "text-sm text-gray-500");

        // Ends at (auction end)
        const endsAt = document.createElement("p");
        endsAt.textContent = `Auction ends: ${new Date(post.endsAt).toLocaleString()}`;
        applyTailwindClasses(endsAt, "text-sm text-red-500 font-semibold mt-2");

        // Total number of bids
        const bidCount = document.createElement("p");
        bidCount.textContent = `Total bids: ${post._count?.bids ?? 0}`;
        applyTailwindClasses(bidCount, "text-sm text-indigo-600 font-medium mt-2");

        // Bid button
        const bidButton = document.createElement("button");
        bidButton.textContent = "Place Bid";
        applyTailwindClasses(bidButton, "bg-Heliotrope text-white px-4 py-2 rounded mt-4");
        bidButton.addEventListener("click", () => {
            console.log(`Bid clicked for post ID ${post.id}`);
        });

        // Bidding history
        const bidHistoryContainer = document.createElement("div");
        applyTailwindClasses(bidHistoryContainer, "mt-4");

        const bidHistoryTitle = document.createElement("h3");
        bidHistoryTitle.textContent = "Bidding History";
        applyTailwindClasses(bidHistoryTitle, "text-lg font-semibold");

        const bidList = document.createElement("ul");
        if (post.bids && post.bids.length > 0) {
            post.bids.forEach((bid) => {
                const bidItem = document.createElement("li");
                const date = new Date(bid.created).toLocaleString();
                bidItem.textContent = `User: ${bid.bidderName || 'Anonymous'}, Amount: ${bid.amount}, Date: ${date}`;
                applyTailwindClasses(bidItem, "mt-2 text-sm text-gray-700");
                bidList.appendChild(bidItem);
            });
        } else {
            const noBids = document.createElement("p");
            noBids.textContent = "No bids yet.";
            applyTailwindClasses(noBids, "mt-2 text-sm text-gray-600");
            bidHistoryContainer.appendChild(noBids);
        }

        // Append everything
        bidHistoryContainer.appendChild(bidHistoryTitle);
        bidHistoryContainer.appendChild(bidList);
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(tags);
        card.appendChild(created);
        card.appendChild(updated);
        card.appendChild(endsAt);
        card.appendChild(bidCount);
        card.appendChild(bidButton);
        card.appendChild(bidHistoryContainer);

        content.appendChild(card);
    } catch (error) {
        console.error("Error displaying single post:", error);
    }
}


displaySinglePost();