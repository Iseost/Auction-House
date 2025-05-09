import { API_BASE, API_KEY } from "../constants.mjs";

export async function getUserPosts(username, accessToken) {
    try {
        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-Noroff-API-Key": API_KEY,
            },
        };

        const response = await fetch(`${API_BASE}/auction/profiles/${username}/listings?_bids=true&_seller=true`, options);

        if (!response.ok) {
            throw new Error(`Failed to fetch user posts: ${response.status}`);
        }

        const json = await response.json();
        return json.data; // viktig: .data gir deg arrayen med posts
    } catch (error) {
        console.error("Error fetching user posts:", error);
    }
}
