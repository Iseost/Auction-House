import { API_SOCIAL_POSTS, API_KEY } from "../constants.mjs";


export async function getFeed(accessToken) {
    try {

        const response = await fetch(API_SOCIAL_POSTS, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-Noroff-API-Key": API_KEY,
            },
        });

        if (response.status !== 200) {
            throw new Error(`Failed to fetch feed. Status: ${data.status}`);
        }
        const data = await response.json();

        return data.data;
    } catch (error) {
        console.error("Error fetching feed:", error);
    }
}