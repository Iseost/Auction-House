import { placeBidListing } from '../api/placeBid.mjs';
import { getSinglePost } from '../api/singlePost.mjs';

export async function onPlaceBid(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const placeBid = Number(form.get('bid'));
    const postId = new URLSearchParams(window.location.search).get("postId");
    const accessToken = localStorage.getItem("accessToken");

    if (!postId || !accessToken) return;

    try {
        await placeBidListing(placeBid, postId, accessToken);

        const response = await getSinglePost(accessToken, postId);
        const updatedPost = response?.data;

        const currentBidEl = document.querySelector("#currentBid");
        const bidCountEl = document.querySelector("#bidCount");
        const modalList = document.querySelector("#modalList");

        if (currentBidEl) currentBidEl.textContent = `Current Bid: ${updatedPost.currentBid}`;
        if (bidCountEl) bidCountEl.textContent = `${updatedPost.bids?.length ?? 0} bids placed`;

        if (modalList) {
            modalList.innerHTML = "";

            updatedPost.bids?.forEach(bid => {
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
        }

        event.target.reset();
    } catch (error) {
        console.error("Error placing bid:", error);
    }
}
