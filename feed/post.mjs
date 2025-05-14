import { getSinglePost } from "../api/singlePost.mjs";
import { onPlaceBid } from "../postActions/placeBid.mjs";

function applyTailwindClasses(element, classes) {
    element.className = classes;
}

function getHighestBid(bids = []) {
    if (!Array.isArray(bids) || bids.length === 0) return null;
    return bids.reduce((max, bid) => bid.amount > max ? bid.amount : max, 0);
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
        const response = await getSinglePost(accessToken, postId);
        const post = response?.data;

        const content = document.getElementById("singlePost_container");

        if (!post) {
            content.innerHTML = "<p>No post to display</p>";
            return;
        }

        const container = document.createElement("div");
        applyTailwindClasses(container, "w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md");

        const img = document.createElement("img");
        img.src = post.media?.[0]?.url || "../src/assets/image.png";
        img.alt = post.media?.[0]?.alt || "Post image";
        applyTailwindClasses(img, "w-full h-auto object-cover rounded");

        const contentContainer = document.createElement("div");
        applyTailwindClasses(contentContainer, "py-6 space-y-6");

        const profile = document.createElement("div");
        applyTailwindClasses(profile, "flex items-center justify-between");

        const user = document.createElement("div");
        applyTailwindClasses(user, "flex items-center gap-4");

        const avatar = document.createElement("img");
        avatar.src = post.seller?.avatar?.url || "../src/assets/image.png";
        avatar.alt = post.seller?.avatar?.alt || `${post.seller?.name || "User"}'s avatar`;
        applyTailwindClasses(avatar, "w-10 h-10 rounded-full");

        const username = document.createElement("span");
        username.textContent = post.seller?.name || "Unknown";
        applyTailwindClasses(username, "font-semibold text-base text-gray-900");

        user.appendChild(avatar);
        user.appendChild(username);

        const date = document.createElement("p");
        date.textContent = new Date(post.created).toLocaleDateString();
        applyTailwindClasses(date, "text-sm text-gray-500");

        profile.appendChild(user);
        profile.appendChild(date);

        const title = document.createElement("h1");
        title.textContent = post.title;
        applyTailwindClasses(title, "text-2xl font-bold text-gray-900");

        const body = document.createElement("p");
        body.textContent = post.description || post.body || "No description.";
        applyTailwindClasses(body, "text-gray-700 leading-relaxed border-b border-darkFaded");

        const auction = document.createElement("div");
        applyTailwindClasses(auction, "space-y-2");

        const endsAt = document.createElement("p");
        endsAt.innerHTML = `<strong>Auction Ends:</strong> ${new Date(post.endsAt).toLocaleDateString()}`;
        applyTailwindClasses(endsAt, "text-sm text-gray-600");

        const endsIn = document.createElement("p");
        const timeLeft = new Date(post.endsAt) - new Date();
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((timeLeft / (1000 * 60)) % 60);
        const secs = Math.floor((timeLeft / 1000) % 60);
        endsIn.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
        applyTailwindClasses(endsIn, "text-sm text-gray-600 border-b border-darkFaded");

        const bidding = document.createElement("div");
        applyTailwindClasses(bidding, "space-y-4");

        const currentBid = document.createElement("p");
        currentBid.id = "currentBid";

        const highestBid = getHighestBid(post.bids);
        currentBid.textContent = `Current Bid: ${highestBid !== null ? highestBid + " credits" : "No bids yet"}`;
        applyTailwindClasses(currentBid, "text-base font-medium text-gray-800");

        const bidCount = document.createElement("p");
        bidCount.id = "bidCount";
        bidCount.textContent = `${post.bids?.length ?? 0} bids placed`;
        applyTailwindClasses(bidCount, "text-sm text-gray-500");

        const buttonsContainer = document.createElement("div");
        applyTailwindClasses(buttonsContainer, "flex items-center gap-3");

        const form = document.createElement("form");
        applyTailwindClasses(form, "flex flex-col sm:flex-row items-start sm:items-center gap-3");

        const input = document.createElement("input");
        input.name = "bid";
        input.type = "number";
        input.min = 1;
        input.placeholder = "Bid Me 🪙";
        applyTailwindClasses(input, "border border-gray-300 rounded px-4 py-2 text-sm w-full sm:w-auto");

        const bidBtn = document.createElement("button");
        bidBtn.type = "submit";
        bidBtn.textContent = "Bid Me";
        applyTailwindClasses(bidBtn, "bg-malta hover:bg-hover_malta text-white px-4 py-2 rounded");

        const viewBidsBtn = document.createElement("button");
        viewBidsBtn.type = "button";
        viewBidsBtn.textContent = "View Bids";
        applyTailwindClasses(viewBidsBtn, "bg-allports hover:bg-hover_allports text-white px-4 py-2 rounded");

        buttonsContainer.appendChild(input);
        buttonsContainer.appendChild(bidBtn);
        buttonsContainer.appendChild(viewBidsBtn);
        form.appendChild(buttonsContainer);

        // Legg til login-prompt modal
        const loginPromptModal = document.createElement("div");
        loginPromptModal.id = "loginPromptModal";
        loginPromptModal.style.display = "none";
        applyTailwindClasses(loginPromptModal, "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center");

        const loginPromptContent = document.createElement("div");
        applyTailwindClasses(loginPromptContent, "bg-white p-6 rounded shadow-lg text-center");

        const loginPromptText = document.createElement("p");
        loginPromptText.textContent = "You must be logged in to place a bid.";
        applyTailwindClasses(loginPromptText, "mb-4 text-gray-800");

        const closeLoginPrompt = document.createElement("button");
        closeLoginPrompt.textContent = "Okay";
        applyTailwindClasses(closeLoginPrompt, "bg-allports hover:bg-blue-700 text-white px-4 py-2 rounded");

        closeLoginPrompt.addEventListener("click", () => {
            window.location.href = "../auth/login.html";
        });

        loginPromptContent.appendChild(loginPromptText);
        loginPromptContent.appendChild(closeLoginPrompt);
        loginPromptModal.appendChild(loginPromptContent);
        document.body.appendChild(loginPromptModal);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                loginPromptModal.style.display = "flex";
                return;
            }

            onPlaceBid(e);
        });

        const modalContainer = document.createElement("div");
        modalContainer.style.display = "none";
        applyTailwindClasses(modalContainer, "fixed inset-0 bg-opacity-50 flex justify-center items-center backdrop-blur-lg");

        const modalContent = document.createElement("div");
        applyTailwindClasses(modalContent, "bg-white p-6 rounded-lg shadow-lg w-80");

        const modalHeader = document.createElement("h2");
        modalHeader.textContent = "Bidder List";
        applyTailwindClasses(modalHeader, "text-xl font-semibold mb-4");

        const modalList = document.createElement("ul");
        modalList.id = "modalList";
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
                    listItem.className = "flex items-center justify-between bg-gray-100 p-3 rounded-lg";

                    const profile = document.createElement("div");
                    profile.className = "flex items-center gap-3";

                    const avatar = document.createElement("img");
                    avatar.src = bid.bidder?.avatar?.url || "https://placehold.co/40x40";
                    avatar.alt = bid.bidder?.name;
                    avatar.className = "w-10 h-10 rounded-full object-cover";

                    const name = document.createElement("span");
                    name.textContent = bid.bidder?.name || "Unknown";
                    name.className = "font-medium";

                    profile.appendChild(avatar);
                    profile.appendChild(name);

                    const amount = document.createElement("span");
                    amount.textContent = bid.amount;
                    amount.className = "font-semibold text-gray-800";

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

        bidding.appendChild(currentBid);
        bidding.appendChild(bidCount);
        bidding.appendChild(form);

        contentContainer.appendChild(profile);
        contentContainer.appendChild(title);
        contentContainer.appendChild(body);
        contentContainer.appendChild(auction);
        auction.appendChild(endsAt);
        auction.appendChild(endsIn);
        contentContainer.appendChild(bidding);

        container.appendChild(img);
        container.appendChild(contentContainer);
        content.appendChild(container);
    } catch (error) {
        console.error("Error displaying single post:", error);
    }
}

displaySinglePost();
