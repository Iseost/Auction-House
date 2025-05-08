const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

export function formatDate(data) {
    const formattedDate = new Date(data);

    return `${formattedDate.getDate()}
    ${months[formattedDate.getMonth()]}
    ${formattedDate.getFullYear()}`;
}

export function auctionTimeLeft(endTime) {
    const timerElement = document.createElement('span');
    timerElement.classList.add('countdown-timer');

    function updateCountdown() {
        const now = new Date();
        const end = new Date(endTime);
        const timeLeft = end - now;

        if (timeLeft <= 0) {
            timerElement.textContent = 'Auction Ended';
            timerElement.classList.add('font-semibold');
            clearInterval(timerInterval);
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        let timeString = '';
        if (days > 0) {
            timeString += `${days}d `;
        }
        if (hours > 0 || days > 0) {
            timeString += `${hours}h `;
        }
        timeString += `${minutes}m ${seconds}s`;

        timerElement.textContent = timeString.trim();
        timerElement.classList.add('font-semibold');
    }

    const timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return timerElement;
}