import { API_AUCTION_LISTINGS, API_KEY } from "../constants.mjs";

const saveButton = document.getElementById("save_create");

saveButton.addEventListener("click", async () => {
    const title = document.getElementById("create_title").value.trim();
    const deadline = document.getElementById("create_deadline").value;
    const imagesRaw = document.getElementById("create_images").value.trim();
    const description = document.getElementById("create_description").value.trim();

    if (!title || !deadline || !imagesRaw || !description) {
        alert("Please fill in all fields.");
        return;
    }

    const media = imagesRaw
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url !== "");

    const listingData = {
        title,
        description,
        media,
        endsAt: deadline,
    };

    try {
        const response = await fetch(API_AUCTION_LISTINGS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "X-Noroff-API-Key": API_KEY,
            },
            body: JSON.stringify(listingData),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Listing created successfully!");
            // Redirect til f.eks. forsiden eller egen profil
            window.location.href = "./index.html";
        } else {
            console.error(result);
            alert(result.errors?.[0]?.message || "Something went wrong.");
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error. Please try again later.");
    }
});


// export async function deletePost(accessToken, postId) {
//  try {
// const response = await fetch(`${API_AUCTION_LISTINGS}/${postId}`, {
//     method: "DELETE",
//   headers: {
//     "Authorization": `Bearer ${accessToken}`,
//  "X-Noroff-API-Key": API_KEY,
// },
// });
// if (response.status !== 204) throw new Error("Failed to delete post");
// console.log("Post deleted successfully");
// } catch (error) {
// console.error("Error deleting post:", error);
// }
// }

//export async function updatePost(accessToken, postId, postData) {
// try {
//   const response = await fetch(`${API_AUCTION_LISTINGS}/${postId}`, {
//       method: "PUT",
//     headers: {