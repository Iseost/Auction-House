export function renderBidList(bids) {
    const bidList = document.createElement("ul");
    bidList.className = "space-y-3 text-sm text-gray-700 dark:text-gray-300";

    if (!bids || !Array.isArray(bids)) {
        return bidList;
    }

    bids
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .forEach((bid) => {
            const listItem = document.createElement("li");
            listItem.className = "flex items-center gap-3";

            const avatar = document.createElement("img");
            avatar.src = bid.bidderAvatar || "../src/assets/image.png";
            avatar.alt = bid.bidderName || "User avatar";
            avatar.className = "w-8 h-8 rounded-full";

            const text = document.createElement("span");
            text.textContent = `${bid.bidderName}: ${bid.amount} 🪙`;

            listItem.appendChild(avatar);
            listItem.appendChild(text);
            bidList.appendChild(listItem);
        });

    return bidList;
}
