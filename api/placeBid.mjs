
import { API_AUCTION_LISTINGS } from '../constants.mjs';

export async function placeBidListing(body) {
    const id = new URLSearchParams(window.location.search).get('postId');

    if (!id) {
        console.error("Missing postId in URL.");
        return;
    }

    try {
        const url = `${API_AUCTION_LISTINGS}/${id}/bids`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ amount: Number(body) }),
        });

        if (!response.ok) {
            alert('Could not place bid');
        } else {
            const data = await response.json();
            setTimeout(() => window.location.reload(), 500);
            return data;
        }
    } catch (error) {
        alert('Error placing bid on auction listing: ' + error);
    }
}

