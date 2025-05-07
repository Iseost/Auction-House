import { getFeed } from "../api/feed.mjs";

function applyTailwindClasses(element, classNames) {
    element.classList.add(...classNames.split(" "));
}

const posts = await getFeed(localStorage.getItem("accessToken"));
console.log(posts); // Debug

export function createPostBox(coverImage, postTitle, postBody, id) {
    const content = document.getElementById("post_container");

    const card = document.createElement("div");
    applyTailwindClasses(card, "flex flex-col m-4 p-4 rounded-lg bg-white cursor-pointer max-w-sm border border-gray-300 px-4 py-2");

    const postImage = document.createElement("img");
    postImage.src = coverImage || "./src/assets/image.png";
    postImage.alt = "Post Image";
    applyTailwindClasses(postImage, "w-full h-auto rounded-md");
    postImage.addEventListener("click", () => {
        window.location.href = `./feed/post.html?id=${id}`;
    });

    const title = document.createElement("h2");
    title.innerText = postTitle;
    applyTailwindClasses(title, "text-xl font-semibold mt-4");

    const smallText = document.createElement("p");
    smallText.innerText = postBody;
    applyTailwindClasses(smallText, "text-gray-600 mt-2 text-sm");

    const button = document.createElement("button");
    button.innerText = "Read more";
    applyTailwindClasses(button, "bg-Heliotrope text-white px-4 py-2 rounded");
    button.addEventListener("click", () => {
        window.location.href = `./feed/post.html?id=${id}`;
    });

    card.append(postImage, title, smallText, button);
    content.appendChild(card);
}

if (posts && posts.length > 0) {
    posts.forEach((post) => {
        createPostBox(
            post.media?.[0]?.url,
            post.title,
            post.description,
            post.id
        );
    });
} else {
    console.log("No posts available.");
}
