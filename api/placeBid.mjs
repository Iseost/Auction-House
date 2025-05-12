import { API_AUCTION_LISTINGS, API_KEY } from '../constants.mjs';

export async function placeBidListing(body) {
    const id = new URLSearchParams(window.location.search).get('postId');

    if (!id) {
        console.error("Missing postId in URL.");
        return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert("Du må være logget inn for å legge inn bud.");
        return;
    }

    try {
        const url = `${API_AUCTION_LISTINGS}/${id}/bids`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-Noroff-API-Key': API_KEY,
            },
            body: JSON.stringify({ amount: Number(body) }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.warn("API error response:", errorData);
            alert(`Kunne ikke legge inn bud: ${errorData.errors?.[0]?.message || response.statusText}`);
        } else {
            const data = await response.json();
            setTimeout(() => window.location.reload(), 500);
            return data;
        }
    } catch (error) {
        alert('Error placing bid on auction listing: ' + error);
    }
}
