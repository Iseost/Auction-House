import { placeBidListing } from '../api/placeBid.mjs';

export async function onPlaceBid(event) {
    event.preventDefault();

    const form = new FormData(event.target);

    const placeBid = Number(form.get('bid'));

    await placeBidListing(placeBid);
}