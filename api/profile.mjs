import { API_AUCTION_PROFILES, API_KEY } from "../constants.mjs";

export async function getProfile(accessToken, username) {
    try {
        const data = await fetch(`${API_AUCTION_PROFILES}/${username}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-Noroff-API-Key": API_KEY,
            },
        });

        if (data.status !== 200) {
            throw new Error(`Failed to fetch profile. Status: ${data.status}`);
        }

        return await data.json();
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}
