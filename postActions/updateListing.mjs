import { updatePost, deletePost } from "../api/postActions.mjs";
import { getUserPosts } from "../api/userPosts.mjs";
import { getProfile } from "../api/profile.mjs";

document.addEventListener("DOMContentLoaded", async () => {
    const postId = new URLSearchParams(window.location.search).get("id");
    if (!postId) {
        alert("Post ID is missing in the URL.");
        return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");

    if (!accessToken || !username) {
        alert("You are not logged in. Please log in first.");
        window.location.href = "/login";
        return;
    }

    let profile;
    try {
        profile = await getProfile(accessToken, username);
        if (!profile) {
            document.body.innerHTML = '<div class="flex justify-center items-center min-h-screen"><p class="text-red-600 text-xl">Failed to fetch profile.</p></div>';
            return;
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
        document.body.innerHTML = '<div class="flex justify-center items-center min-h-screen"><p class="text-red-600 text-xl">An error occurred while fetching your profile. Please try again.</p></div>';
        return;
    }

    let userPosts;
    try {
        userPosts = await getUserPosts(username, accessToken);
        if (!userPosts || userPosts.length === 0) {
            document.body.innerHTML = '<div class="flex justify-center items-center min-h-screen"><p class="text-red-600 text-xl">No posts found for the user.</p></div>';
            return;
        }
    } catch (error) {
        console.error("Error fetching user posts:", error);
        document.body.innerHTML = '<div class="flex justify-center items-center min-h-screen"><p class="text-red-600 text-xl">An error occurred while fetching your posts. Please try again.</p></div>';
        return;
    }

    const post = userPosts.find(p => p.id.toString() === postId);
    if (!post) {
        alert("Post not found.");
        return;
    }

    const modal = document.createElement("div");
    modal.id = "editPostModal";
    modal.classList.add("fixed", "inset-0", "z-50", "hidden", "backdrop-blur-sm");
    modal.style.backdropFilter = "blur(10px)";

    const modalContent = document.createElement("div");
    modalContent.classList.add("flex", "justify-center", "items-center", "min-h-screen");

    const modalFormContainer = document.createElement("div");
    modalFormContainer.classList.add("bg-white", "p-8", "rounded-lg", "w-full", "max-w-lg");

    const title = document.createElement("h2");
    title.classList.add("text-2xl", "font-semibold", "text-center", "mb-6");
    title.textContent = "Edit Listing";

    const form = document.createElement("form");
    form.id = "editPostForm";
    form.classList.add("space-y-4");

    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "edit_title");
    titleLabel.classList.add("font-medium");
    titleLabel.textContent = "Title";

    const titleInput = document.createElement("input");
    titleInput.id = "edit_title";
    titleInput.type = "text";
    titleInput.classList.add("w-full", "border", "border-gray-300", "rounded", "px-4", "py-2");
    titleInput.required = true;

    const deadlineLabel = document.createElement("label");
    deadlineLabel.setAttribute("for", "edit_deadline");
    deadlineLabel.classList.add("font-medium");
    deadlineLabel.textContent = "Deadline";

    const deadlineInput = document.createElement("input");
    deadlineInput.id = "edit_deadline";
    deadlineInput.type = "datetime-local";
    deadlineInput.classList.add("w-full", "border", "border-gray-300", "rounded", "px-4", "py-2");
    deadlineInput.required = true;

    const imagesLabel = document.createElement("label");
    imagesLabel.setAttribute("for", "edit_images");
    imagesLabel.classList.add("font-medium");
    imagesLabel.textContent = "Image URLs";

    const imagesTextarea = document.createElement("textarea");
    imagesTextarea.id = "edit_images";
    imagesTextarea.classList.add("w-full", "h-[120px]", "border", "border-gray-300", "rounded", "px-4", "py-2", "resize-none");

    const descriptionLabel = document.createElement("label");
    descriptionLabel.setAttribute("for", "edit_description");
    descriptionLabel.classList.add("font-medium");
    descriptionLabel.textContent = "Description";

    const descriptionTextarea = document.createElement("textarea");
    descriptionTextarea.id = "edit_description";
    descriptionTextarea.classList.add("w-full", "h-[200px]", "border", "border-gray-300", "rounded", "px-4", "py-2", "resize-none");

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("flex", "justify-between", "flex-wrap", "gap-2");

    const saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.classList.add("bg-Blue_Chill", "hover:bg-Blue_Chill/80", "text-white", "py-2", "px-4", "rounded", "transition");
    saveButton.textContent = "Save Changes";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.id = "closeModal";
    cancelButton.classList.add("bg-gray-500", "text-white", "py-2", "px-4", "rounded", "hover:bg-gray-600", "transition");
    cancelButton.textContent = "Cancel";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("bg-red-600", "hover:bg-red-700", "text-white", "py-2", "px-4", "rounded", "transition");
    deleteButton.textContent = "Delete Post";

    buttonsContainer.append(saveButton, cancelButton, deleteButton);
    form.append(titleLabel, titleInput, deadlineLabel, deadlineInput, imagesLabel, imagesTextarea, descriptionLabel, descriptionTextarea, buttonsContainer);

    modalFormContainer.append(title, form);
    modalContent.append(modalFormContainer);
    modal.append(modalContent);
    document.body.append(modal);

    document.getElementById("edit_title").value = post.title;
    document.getElementById("edit_deadline").value = new Date(post.endsAt).toISOString().slice(0, 16);
    document.getElementById("edit_images").value = post.media.map((img) => img.url).join("\n");
    document.getElementById("edit_description").value = post.description;

    modal.classList.remove("hidden");

    document.getElementById("editPostForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedPost = {
            title: document.getElementById("edit_title").value.trim(),
            endsAt: new Date(document.getElementById("edit_deadline").value).toISOString(),
            media: document
                .getElementById("edit_images")
                .value.split("\n")
                .filter(url => url.trim() !== "")
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

    document.getElementById("closeModal").addEventListener("click", () => {
        window.location.href = "/profile/profile.html?username=" + username;
        modal.classList.add("hidden");
    });

    deleteButton.addEventListener("click", async () => {
        const confirmDelete = confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            await deletePost(accessToken, postId);
            alert("Post deleted successfully.");
            window.location.href = "/profile/profile.html?username=" + username;
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Something went wrong when deleting the post.");
        }
    });
});
