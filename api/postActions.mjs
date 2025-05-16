import { API_AUCTION_LISTINGS, API_KEY } from "../constants.mjs";

export async function createPost(accessToken, postData) {
    try {
        const response = await fetch(API_AUCTION_LISTINGS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": API_KEY,
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            throw new Error(`Failed to create post. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}


export async function updatePost(accessToken, postId, postData) {
    try {
        const response = await fetch(`${API_AUCTION_LISTINGS}/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": API_KEY,
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            throw new Error(`Failed to update post. Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating post:", error);
    }
}

export async function deletePost(accessToken, postId) {
    try {
        const response = await fetch(`${API_AUCTION_LISTINGS}/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Noroff-API-Key": API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete post. Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error deleting post:", error);
    }
}

