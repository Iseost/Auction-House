import { updatePost, deletePost } from "../api/postActions.mjs";
import { getUserPosts } from "../api/userPosts.mjs";
import { getProfile } from "../api/profile.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    const postId = new URLSearchParams(window.location.search).get("id");
    if (!postId) {
        alert("Post ID is missing in the URL.");
        return;
    }

    try {

        const accessToken = localStorage.getItem("accessToken");
        const username = localStorage.getItem("username");

        console.log("Access Token:", accessToken);
        console.log("Username:", username);

        if (!accessToken || !username) {
            alert("You are not logged in. Please log in first.");
            window.location.href = "/login";
            return;
        }

        const profile = await getProfile(accessToken, username);
        console.log("Profile:", profile);

        if (!profile) {
            alert("Failed to fetch profile.");
            return;
        }


        const userPosts = await getUserPosts(username, accessToken);
        console.log("User posts:", userPosts);

        if (!userPosts || userPosts.length === 0) {
            alert("No posts found for the user.");
            return;
        }


        const post = userPosts.find(p => p.id.toString() === postId);

        if (!post) {
            alert("Post not found.");
            return;
        }

        document.getElementById("edit_title").value = post.title;
        document.getElementById("edit_deadline").value = new Date(post.endsAt).toISOString().slice(0, 16);
        document.getElementById("edit_images").value = post.media.map((img) => img.url).join("\n");
        document.getElementById("edit_description").value = post.description;


        document.getElementById("editPostForm").addEventListener("submit", async (e) => {
            e.preventDefault();

            const updatedPost = {
                title: document.getElementById("edit_title").value.trim(),
                endsAt: new Date(document.getElementById("edit_deadline").value).toISOString(),
                media: document
                    .getElementById("edit_images")
                    .value.split("\n")
                    .map((url) => ({ url: url.trim(), alt: `Image for ${post.title}` })),
                description: document.getElementById("edit_description").value.trim(),
            };

            if (!updatedPost.title || !updatedPost.endsAt || !updatedPost.media.length || !updatedPost.description) {
                alert("Please fill in all fields.");
                return;
            }

            try {
                await updatePost(accessToken, postId, updatedPost);
                alert("Post updated successfully.");
                window.location.href = "/";
            } catch (error) {
                console.error("Error updating post:", error);
                alert("Something went wrong when updating the post.");
            }
        });


        document.getElementById("delete_post").addEventListener("click", async () => {
            const confirmation = confirm("Are you sure you want to delete this post?");
            if (confirmation) {
                try {
                    await deletePost(accessToken, postId);
                    alert("Post deleted successfully.");
                    window.location.href = "/";
                } catch (error) {
                    console.error("Error deleting post:", error);
                    alert("Something went wrong when deleting the post.");
                }
            }
        });

    } catch (error) {
        console.error("Error fetching user profile or posts:", error);
        alert("Something went wrong when fetching your profile or posts.");
    }
});
