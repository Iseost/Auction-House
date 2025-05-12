import { getFeed } from "../api/feed.mjs";
import { createPostBox } from "./feed.mjs";

const content = document.getElementById("post_container");
const clearSearchBtn = document.getElementById("clearSearch");
const feedImageWrapper = document.getElementById("feedImageWrapper");

let allPosts = [];

function displayPosts(posts) {
    content.innerHTML = "";
    posts.forEach(post => {
        createPostBox(
            post.media?.[0]?.url,
            post.title,
            post.description,
            post.id,
            post.endsAt,
            post.seller?.avatar,
            post.seller?.name,
            post.created
        );
    });
}


async function initFeed(query = "") {
    allPosts = await getFeed(localStorage.getItem("accessToken"));


    const filteredPosts = query
        ? allPosts.filter(post => {
            const title = post.title?.toLowerCase() || "";
            const description = post.description?.toLowerCase() || "";
            return title.includes(query) || description.includes(query);
        })
        : allPosts;


    if (query) {
        clearSearchBtn.classList.remove("hidden");
        feedImageWrapper.classList.add("hidden");
    } else {
        clearSearchBtn.classList.add("hidden");
        feedImageWrapper.classList.remove("hidden");
    }

    if (filteredPosts.length === 0) {
        content.innerHTML = `<p class='text-center text-gray-500'>No results for "${query}"</p>`;
    } else {
        displayPosts(filteredPosts);
    }
}

clearSearchBtn.addEventListener("click", () => {
    window.history.replaceState(null, "", window.location.pathname);
    initFeed();
});

document.addEventListener("search", (e) => {
    const query = e.detail.query.toLowerCase();
    window.history.replaceState(null, "", `?q=${query}`);
    initFeed(query);
});


const params = new URLSearchParams(window.location.search);
const query = params.get("q")?.toLowerCase() || "";
initFeed(query);
