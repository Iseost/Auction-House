import { formatDate, auctionTimeLeft } from "../components/timer.mjs";

function applyTailwindClasses(element, classNames) {
    element.classList.add(...classNames.split(" "));
}

export function createPostBox(coverImage, postTitle, postBody, id, endsAt, avatar, sellerName, created) {
    const content = document.getElementById("post_container");

    const card = document.createElement("div");
    applyTailwindClasses(card, "flex flex-col m-4 p-4 rounded-xl bg-white border border-darkFaded hover:shadow-xl transition-shadow duration-300 cursor-pointer max-w-sm overflow-hidden");

    const header = document.createElement("div");
    applyTailwindClasses(header, "flex justify-between items-center mb-2");

    const profile = document.createElement("div");
    applyTailwindClasses(profile, "flex items-center gap-2");

    const avatarImg = document.createElement("img");
    avatarImg.src = (typeof avatar === 'string' && avatar.trim() !== "") ? avatar : "./src/assets/image.png";
    avatarImg.alt = `${sellerName || "User"}'s avatar`;
    avatarImg.addEventListener("click", () => {
        window.location.href = `../profile/profile.html?username=${sellerName || "Unknown"}`;
    });
    avatarImg.style.cursor = "pointer";
    avatarImg.onerror = () => {
        avatarImg.src = "./src/assets/image.png";
    };
    applyTailwindClasses(avatarImg, "w-8 h-8 rounded-full object-cover");

    const name = document.createElement("span");
    name.innerText = sellerName || "Unknown";
    name.addEventListener("click", () => {
        window.location.href = `../profile/profile.html?username=${sellerName || "Unknown"}`;
    });
    name.style.cursor = "pointer";
    applyTailwindClasses(name, "text-sm font-medium text-gray-800");

    profile.append(avatarImg, name);

    const createdDate = document.createElement("span");
    createdDate.innerText = formatDate(created);
    applyTailwindClasses(createdDate, "text-xs text-gray-500");

    header.append(profile, createdDate);

    const imageContainer = document.createElement("div");
    applyTailwindClasses(imageContainer, "flex items-center justify-center w-full max-h-[200px] sm:max-h-[240px] h-full cursor-pointer overflow-hidden drop-shadow-darkFaded");

    const postImage = document.createElement("img");
    postImage.src = coverImage || "./src/assets/image.png";
    postImage.alt = "Post Image";
    applyTailwindClasses(postImage, "object-cover w-full h-full hover:scale-110 transition-transform duration-300");
    postImage.addEventListener("click", () => {
        window.location.href = `./feed/post.html?postId=${id}`;
    });

    imageContainer.appendChild(postImage);

    const title = document.createElement("h2");
    title.innerText = postTitle;
    applyTailwindClasses(title, "text-xl font-semibold mt-4 line-clamp-1");

    const smallText = document.createElement("p");
    smallText.innerText = postBody;
    applyTailwindClasses(smallText, "text-gray-600 mt-2 text-sm line-clamp-2 border-b border-darkFaded dark:border-whiteFaded pb-2");

    const endDate = document.createElement("p");
    endDate.innerText = `Ends: ${formatDate(endsAt)}`;
    applyTailwindClasses(endDate, "text-xs text-gray-500 mt-1");

    const timer = auctionTimeLeft(endsAt);
    applyTailwindClasses(timer, "text-sm text-red-600 mt-2");

    const button = document.createElement("button");
    button.innerText = "Make a Bid";
    applyTailwindClasses(button, "mt-3 bg-Heliotrope text-white px-4 py-2 rounded hover:opacity-90 transition-opacity duration-200");
    button.addEventListener("click", () => {
        window.location.href = `./feed/post.html?postId=${id}`;
    });

    card.append(header, imageContainer, title, smallText, endDate, timer, button);
    content.appendChild(card);
}


