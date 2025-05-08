import { getFeed } from "../api/feed.mjs";
import { createPostBox } from "../feed/feed.mjs";

const params = new URLSearchParams(window.location.search);
const query = params.get("q")?.toLowerCase();

async function showSearchResults() {
    const posts = await getFeed(localStorage.getItem("accessToken"));
    const results = posts.filter(post => {
        const title = post.title?.toLowerCase() || "";
        const description = post.description?.toLowerCase() || "";
        return title.includes(query) || description.includes(query);
    });

    if (results.length === 0) {
        const noResults = document.createElement("p");
        noResults.textContent = `No results for "${query}"`;
        noResults.className = "text-center text-lg text-gray-500 mt-10";
        document.getElementById("post_container").appendChild(noResults);
        return;
    }

    results.forEach(post => {
        createPostBox(
            post.media?.[0]?.url,
            post.title,
            post.description,
            post.id,
            post.endsAt
        );
    });
}

if (query) {
    showSearchResults();
}
