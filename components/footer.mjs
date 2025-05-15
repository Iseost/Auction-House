function createFooter() {

    const footer = document.querySelector('footer');

    const footerContainer = document.createElement('div');
    footerContainer.className = 'flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200 bg-white text-gray-600 text-sm';

    const image = document.createElement('img');
    image.src = '/src/assets/ChatGPT Image 12. mai 2025, 10_59_34.png';
    image.alt = 'Footer Logo';
    image.className = 'w-10 h-10 rounded-full';

    const text = document.createElement('p');
    text.innerHTML = '&copy; Auction House 2025';

    footerContainer.appendChild(image);
    footerContainer.appendChild(text);
    footer.appendChild(footerContainer);
    footer.appendChild(footerContainer);
}
createFooter();