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
        // Hent token og brukernavn fra localStorage
        const accessToken = localStorage.getItem("authToken");  // Bytt ut med riktig metode hvis tokenet er lagret et annet sted
        const username = localStorage.getItem("username");  // Bytt ut med riktig metode for å hente brukernavnet

        console.log("Access Token:", accessToken);  // Legg til logging
        console.log("Username:", username);  // Legg til logging

        if (!accessToken || !username) {
            alert("You are not logged in. Please log in first.");
            window.location.href = "/login"; // Omdiriger til innloggingsside
            return;
        }

        // Hent brukerens profil
        const profile = await getProfile(accessToken, username);
        console.log("Profile:", profile);  // Logg profilen for å se om det fungerer

        if (!profile) {
            alert("Failed to fetch profile.");
            return;
        }

        // Hent brukerens innlegg
        const userPosts = await getUserPosts(username, accessToken);
        console.log("User posts:", userPosts);  // Logg innleggene for å sjekke responsen

        if (!userPosts || userPosts.length === 0) {
            alert("No posts found for the user.");
            return;
        }

        // Finn innlegget med gitt postId
        const post = userPosts.find(p => p._id === postId);
        if (!post) {
            alert("Post not found.");
            return;
        }

        // Fyll inn feltene med post-data
        document.getElementById("edit_title").value = post.title;
        document.getElementById("edit_deadline").value = new Date(post.endsAt).toISOString().slice(0, 16);
        document.getElementById("edit_images").value = post.media.map((img) => img.url).join("\n");
        document.getElementById("edit_description").value = post.description;

        // Håndter lagring av endringer
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
                window.location.href = `../profile/profile.html/${postId}`;
            } catch (error) {
                console.error("Error updating post:", error);
                alert("Something went wrong when updating the post.");
            }
        });

        // Håndter sletting av innlegg
        document.getElementById("delete_post").addEventListener("click", async () => {
            const confirmation = confirm("Are you sure you want to delete this post?");
            if (confirmation) {
                try {
                    await deletePost(accessToken, postId);
                    alert("Post deleted successfully.");
                    window.location.href = "/";  // Redirect to homepage or relevant page
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
