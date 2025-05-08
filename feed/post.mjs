import { getSinglePost } from "../api/singlePost.mjs";
import { onPlaceBid } from "../postActions/placeBid.mjs";

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
        applyTailwindClasses(card, "max-w-3xl mx-auto bg-white dark:bg-darkBG rounded-lg shadow-md overflow-hidden mt-8");

        // Media
        const img = document.createElement("img");
        img.src = post.media?.[0]?.url || "../src/assets/image.png";
        img.alt = post.media?.[0]?.alt || "Post image";
        applyTailwindClasses(img, "w-full h-64 object-cover");

        // Content container
        const container = document.createElement("div");
        applyTailwindClasses(container, "p-6 space-y-4");

        // Profile section
        const profile = document.createElement("div");
        applyTailwindClasses(profile, "flex items-center justify-between");

        const user = document.createElement("div");
        applyTailwindClasses(user, "flex items-center gap-3");

        const avatar = document.createElement("img");
        avatar.src = post.seller?.avatar || "../src/assets/avatar.png";
        avatar.alt = post.seller?.name || "User avatar";
        applyTailwindClasses(avatar, "w-10 h-10 rounded-full");

        const username = document.createElement("span");
        username.textContent = post.seller?.name || "Unknown";
        applyTailwindClasses(username, "font-medium text-gray-900 dark:text-white");

        user.appendChild(avatar);
        user.appendChild(username);

        const date = document.createElement("p");
        date.textContent = new Date(post.created).toLocaleDateString();
        applyTailwindClasses(date, "text-sm text-gray-500");

        profile.appendChild(user);
        profile.appendChild(date);

        // Title
        const title = document.createElement("h1");
        title.textContent = post.title;
        applyTailwindClasses(title, "text-2xl font-bold text-gray-900 dark:text-white");

        // Description
        const body = document.createElement("p");
        body.textContent = post.description || post.body || "No description.";
        applyTailwindClasses(body, "text-gray-700 dark:text-gray-300");

        // Auction info
        const auction = document.createElement("div");
        applyTailwindClasses(auction, "mt-4 space-y-1");

        const endsAt = document.createElement("p");
        endsAt.innerHTML = `<strong>Auction Ends:</strong> ${new Date(post.endsAt).toLocaleDateString()}`;

        const endsIn = document.createElement("p");
        const timeLeft = new Date(post.endsAt) - new Date();
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((timeLeft / (1000 * 60)) % 60);
        const secs = Math.floor((timeLeft / 1000) % 60);
        endsIn.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;

        applyTailwindClasses(endsAt, "text-sm text-gray-600 dark:text-gray-400");
        applyTailwindClasses(endsIn, "text-sm text-gray-600 dark:text-gray-400");

        // Bidding area
        // Bidding area
        const bidding = document.createElement("div");
        applyTailwindClasses(bidding, "mt-4 space-y-2");

        const currentBid = document.createElement("p");
        currentBid.textContent = `Current Bid: ${post.currentBid || "No bids yet"}`;
        applyTailwindClasses(currentBid, "text-sm text-gray-600 dark:text-gray-400");

        const form = document.createElement("form");
        applyTailwindClasses(form, "flex items-center gap-2");

        // Legg til event listener for å bruke onPlaceBid
        form.addEventListener("submit", onPlaceBid);

        const input = document.createElement("input");
        input.type = "number";
        input.min = 1;
        input.placeholder = "Bid Me 🪙";
        applyTailwindClasses(input, "border rounded px-3 py-1 text-sm");

        const bidBtn = document.createElement("button");
        bidBtn.type = "submit";
        bidBtn.textContent = "Bid Me";
        applyTailwindClasses(bidBtn, "bg-allports text-white px-4 py-2 rounded");

        form.appendChild(input);
        form.appendChild(bidBtn);


        // View Bids Button
        const viewBtn = document.createElement("button");
        viewBtn.textContent = "View Bids";
        applyTailwindClasses(viewBtn, "bg-allports text-white px-4 py-2 rounded");

        bidding.appendChild(currentBid);
        bidding.appendChild(form);
        bidding.appendChild(viewBtn);

        // Append all to container
        container.appendChild(profile);
        container.appendChild(title);
        container.appendChild(body);
        container.appendChild(auction);
        auction.appendChild(endsAt);
        auction.appendChild(endsIn);
        container.appendChild(bidding);

        card.appendChild(img);
        card.appendChild(container);
        content.appendChild(card);
    } catch (error) {
        console.error("Error displaying single post:", error);
    }
}

displaySinglePost();
