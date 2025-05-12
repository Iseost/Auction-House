import { API_AUCTION_LISTINGS, API_KEY } from "../constants.mjs";


export async function getFeed(accessToken) {
    const url = `${API_AUCTION_LISTINGS}?sort=created&sortOrder=desc`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-Noroff-API-Key": API_KEY,
            },
        });

        if (response.status !== 200) {
            throw new Error(`Failed to fetch feed. Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching feed:", error);
    }
}
