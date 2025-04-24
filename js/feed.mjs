import { getFeed } from "../api/feed.mjs";

function applyTailwindClasses(element, classNames) {
    element.classList.add(...classNames.split(" "));
}

let posts = await getFeed(localStorage.getItem("accessToken"));

export function createPostBox(coverImage, postTitle, postBody, id) {
    const content = document.getElementById("post_container");

    // Card container
    const card = document.createElement("div");
    applyTailwindClasses(card, "flex flex-col m-4 p-4 rounded-lg bg-white cursor-pointer max-w-sm ju");


    const postImage = document.createElement("img");
    postImage.src = coverImage || "./src/assets/image.png";
    applyTailwindClasses(postImage, "w-full h-auto rounded-md");

    postImage.addEventListener("click", () => {
        window.location.href = `/`;
    });

    const title = document.createElement("h2");
    title.innerText = postTitle;
    applyTailwindClasses(title, "text-xl font-semibold mt-4");

    const smallText = document.createElement("p");
    smallText.innerText = postBody;
    applyTailwindClasses(smallText, "text-gray-600 mt-2 text-sm");

    const button = document.createElement("button");
    button.innerText = "Read more";
    applyTailwindClasses(button, "ml-2 bg-Heliotrope text-white px-4 py-2 rounded");

    button.addEventListener("click", function () {
        window.location.href = `../feed/singlePost.html?id=${id}`;
    });

    card.appendChild(postImage);
    card.appendChild(title);
    card.appendChild(smallText);
    card.appendChild(button);

    content.appendChild(card);
}

posts.forEach((post) => {
    createPostBox(post.media?.url, post.title, post.body, post.id);
});
