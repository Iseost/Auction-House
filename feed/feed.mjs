import { formatDate, auctionTimeLeft } from "../components/timer.mjs";

function applyTailwindClasses(element, classNames) {
    element.classList.add(...classNames.split(" "));
}

export function createPostBox(coverImage, postTitle, postBody, id, endsAt) {
    const content = document.getElementById("post_container");

    const card = document.createElement("div");
    applyTailwindClasses(card, "flex flex-col m-4 p-4 rounded-xl bg-white border border-darkFaded hover:shadow-xl transition-shadow duration-300 cursor-pointer max-w-sm overflow-hidden");

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
    button.innerText = "Read more";
    applyTailwindClasses(button, "mt-3 bg-Heliotrope text-white px-4 py-2 rounded hover:opacity-90 transition-opacity duration-200");
    button.addEventListener("click", () => {
        window.location.href = `./feed/post.html?postId=${id}`;
    });

    card.append(imageContainer, title, smallText, endDate, timer, button);
    content.appendChild(card);
}
