
import { API_AUCTION_LISTINGS } from '../constants.mjs';

export async function placeBidListing(body) {
    const id = new URLSearchParams(window.location.search).get('id');
    try {
        const url = `${API_AUCTION_LISTINGS}/${id}/bids?_seller=true&_bids=true`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ amount: body }),
        });

        if (!response.ok) {
            alert('Could not place bid');
        } else {
            const data = await response.json();

            setTimeout(() => {
                window.location.reload();
            }, 500);
            return data;
        }
    } catch (error) {
        alert(error, 'Error placing bid on auction listing');
    }
}
