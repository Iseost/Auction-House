import { API_AUCTION_LISTINGS, API_KEY, INCLUDE_BIDS_AND_SELLER } from "../constants.mjs";

export async function getUserPosts(username, accessToken) {
    try {
        const response = await fetch(`${API_AUCTION_LISTINGS}/${username}/${INCLUDE_BIDS_AND_SELLER}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-Noroff-API-Key": API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user posts: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user posts:", error);
    }
}
