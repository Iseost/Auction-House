import { logout } from '../components/logout.mjs';
import { getProfile } from '../api/profile.mjs';

function createHeader() {
    const loggedIn = localStorage.getItem('username') ? true : false;
    const header = document.querySelector('header');

    const nav = document.createElement('nav');
    nav.className = 'nav-container relative flex justify-between items-center p-4 bg-white shadow';

    const burgerButton = document.createElement('button');
    burgerButton.innerHTML = '&#9776;'; // ☰
    burgerButton.setAttribute('aria-label', 'Toggle menu');
    burgerButton.className = 'text-3xl text-Blue_Chill z-50';
    nav.appendChild(burgerButton);

    const menuWrapper = document.createElement('div');
    menuWrapper.className = `
        fixed top-0 right-0 h-full bg-white shadow-lg 
        transform translate-x-full transition-transform duration-300 ease-in-out 
        w-2/3 sm:w-1/2 max-w-xs z-40 p-6 flex flex-col gap-4
    `;

    const creditDisplay = document.createElement('p');
    creditDisplay.id = 'creditsDisplay';
    creditDisplay.className = 'text-lg text-Blue_Chill font-semibold'; // Du kan justere stilene etter behov
    menuWrapper.appendChild(creditDisplay);

    async function updateCreditDisplay() {
        const accessToken = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');
        if (!accessToken || !username) return;

        try {
            const profile = await getProfile(accessToken, username);
            if (profile) {
                creditDisplay.textContent = `💰 Credits: ${profile.data.credits}`;
            }
        } catch (error) {
            console.error('Feil ved henting av kreditt:', error);
        }
    }

    updateCreditDisplay();

    const menu = document.createElement('div');
    menu.className = 'flex flex-col gap-4';

    const feedButton = document.createElement('button');
    feedButton.textContent = 'Home';
    feedButton.className = 'text-white bg-Blue_Chill px-4 py-2 rounded hover:bg-Blue_Chill/80 transition';
    feedButton.addEventListener('click', () => window.location.href = '../index.html');
    menu.appendChild(feedButton);

    if (loggedIn) {
        const profileButton = document.createElement('button');
        profileButton.textContent = 'Profile';
        profileButton.className = 'text-white bg-Blue_Chill px-4 py-2 rounded hover:bg-Blue_Chill/80 transition';
        profileButton.addEventListener('click', () => {
            const username = localStorage.getItem('username');
            if (username) {
                window.location.href = `../profile/profile.html?username=${username}`;
            } else {
                alert('Please log in to access your profile.');
            }
        });

        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Logout';
        logoutButton.className = 'text-white bg-Blue_Chill px-4 py-2 rounded hover:bg-Blue_Chill/80 transition';
        logoutButton.addEventListener('click', logout);

        menu.appendChild(profileButton);
        menu.appendChild(logoutButton);
    } else {
        const loginButton = document.createElement('button');
        loginButton.textContent = 'Sign in';
        loginButton.className = 'text-white bg-Blue_Chill px-4 py-2 rounded hover:bg-Blue_Chill/80 transition';
        loginButton.addEventListener('click', () => window.location.href = '../auth/login.html');

        const registerButton = document.createElement('button');
        registerButton.textContent = 'Sign up';
        registerButton.className = 'text-white bg-Blue_Chill px-4 py-2 rounded hover:bg-Blue_Chill/80 transition';
        registerButton.addEventListener('click', () => window.location.href = '../auth/register.html');

        menu.appendChild(loginButton);
        menu.appendChild(registerButton);
    }

    menuWrapper.appendChild(menu);
    nav.appendChild(menuWrapper);

    const searchForm = document.createElement('form');
    searchForm.className = 'absolute right-4 flex items-center gap-2';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';
    searchInput.className = 'border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-Blue_Chill';

    const searchButton = document.createElement('button');
    searchButton.type = 'submit';
    searchButton.textContent = 'Search';
    searchButton.className = 'bg-Blue_Chill text-white px-4 py-2 rounded hover:bg-Heliotrope';

    searchForm.appendChild(searchInput);
    searchForm.appendChild(searchButton);
    nav.appendChild(searchForm);

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            const searchEvent = new CustomEvent('search', {
                detail: { query }
            });
            document.dispatchEvent(searchEvent);
        }
    });

    burgerButton.addEventListener('click', () => {
        menuWrapper.classList.toggle('translate-x-full');
    });

    header.appendChild(nav);
}

createHeader();
