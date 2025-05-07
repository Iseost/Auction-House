import { API_AUCTION_LISTINGS, API_KEY } from "../constants.mjs";

export async function getSinglePost(accessToken, postId) {
    try {
        const url = `${API_AUCTION_LISTINGS}/${postId}?_bids=true&_seller=true`;

        const data = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-Noroff-API-Key": API_KEY,
            },
        });

        if (data.status !== 200) {
            throw new Error(`Failed to fetch post. Status: ${data.status}`);
        }

        return await data.json();
    } catch (error) {
        console.error("Error fetching post:", error);
    }
}

