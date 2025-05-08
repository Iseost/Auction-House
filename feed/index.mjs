import { getFeed } from "../api/feed.mjs";
import { createPostBox } from "./feed.mjs";

const content = document.getElementById("post_container");
let allPosts = [];

function displayPosts(posts) {
    content.innerHTML = "";
    posts.forEach(post => {
        createPostBox(
            post.media?.[0]?.url,
            post.title,
            post.description,
            post.id,
            post.endsAt
        );
    });
}

async function initFeed() {
    allPosts = await getFeed(localStorage.getItem("accessToken"));
    if (allPosts.length > 0) {
        displayPosts(allPosts);
    } else {
        content.innerHTML = "<p class='text-center text-gray-500'>No posts available.</p>";
    }
}

document.addEventListener("search", (e) => {
    const query = e.detail.query.toLowerCase();
    const filtered = allPosts.filter(post => {
        const title = post.title?.toLowerCase() || "";
        const description = post.description?.toLowerCase() || "";
        return title.includes(query) || description.includes(query);
    });

    if (filtered.length === 0) {
        content.innerHTML = `<p class='text-center text-gray-500'>No results for "${query}"</p>`;
    } else {
        displayPosts(filtered);
    }
});

initFeed();
