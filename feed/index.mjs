import { getFeed } from "../api/feed.mjs";
import { createPostBox } from "./feed.mjs";

const posts = await getFeed(localStorage.getItem("accessToken"));

if (posts && posts.length > 0) {
    posts.forEach((post) => {
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
} else {
    console.log("No posts available.");
}
