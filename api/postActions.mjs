import { API_AUCTION_LISTINGS, API_KEY } from "../constants.mjs";


export async function deletePost(accessToken, postId) {
    try {
        const response = await fetch(`${API_AUCTION_LISTINGS}/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "X-Noroff-API-Key": API_KEY,
            },
        });
        if (response.status !== 204) throw new Error("Failed to delete post");
        console.log("Post deleted successfully");
    } catch (error) {
        console.error("Error deleting post:", error);
    }
}

//export async function updatePost(accessToken, postId, postData) {
// try {
//   const response = await fetch(`${API_AUCTION_LISTINGS}/${postId}`, {
//       method: "PUT",
//     headers: {