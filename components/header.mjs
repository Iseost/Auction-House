import { logout } from '../components/logout.mjs';

function createHeader() {
    const loggedIn = localStorage.getItem('username') ? true : false;
    const header = document.querySelector('header');

    const nav = document.createElement('nav');
    nav.classList = 'nav-container flex justify-between items-center p-4 bg-white shadow';

    // LEFT: Menu
    const menu = document.createElement('div');
    menu.classList = 'menu flex items-center gap-4';

    const feedButton = document.createElement('button');
    feedButton.textContent = 'Feed';
    feedButton.className = 'text-white bg-Blue_Chill px-4 py-2 rounded hover:bg-Blue_Chill/80 transition';
    feedButton.addEventListener('click', () => {
        window.location.href = '../feed/feed.html';
    });

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
        logoutButton.classList = 'logout_button ml-2 bg-Blue_Chill text-white px-4 py-2 rounded hover:bg-Heliotrope';
        logoutButton.textContent = 'Logout';
        logoutButton.addEventListener('click', function () {
            logout();
        });

        menu.appendChild(profileButton);
        menu.appendChild(logoutButton);
    } else {
        const loginButton = document.createElement('button');
        loginButton.classList = 'login_button ml-2 bg-Blue_Chill text-white px-4 py-2 rounded hover:bg-Heliotrope';
        loginButton.textContent = 'Sign in';
        loginButton.addEventListener('click', function () {
            window.location.href = '../auth/login.html';
        });

        const registerButton = document.createElement('button');
        registerButton.classList = 'register_button ml-2 bg-Blue_Chill text-white px-4 py-2 rounded hover:bg-Heliotrope';
        registerButton.textContent = 'Sign up';
        registerButton.addEventListener('click', function () {
            window.location.href = '../auth/register.html';
        });

        menu.appendChild(loginButton);
        menu.appendChild(registerButton);
    }

    // RIGHT: Search bar
    const searchForm = document.createElement('form');
    searchForm.classList = 'search-form flex items-center';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';
    searchInput.classList = 'border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-Blue_Chill';

    const searchButton = document.createElement('button');
    searchButton.type = 'submit';
    searchButton.textContent = 'Search';
    searchButton.classList = 'ml-2 bg-Blue_Chill text-white px-4 py-2 rounded hover:bg-Heliotrope';

    searchForm.appendChild(searchInput);
    searchForm.appendChild(searchButton);

    // Optional: handle search logic
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            // Do your thing: maybe redirect to a search page or filter content?
            window.location.href = `../feed/search.html?q=${encodeURIComponent(query)}`;
        }
    });

    nav.appendChild(menu);
    nav.appendChild(searchForm);
    header.appendChild(nav);
}


createHeader();

