import { logout } from '../components/logout.mjs';

function createHeader() {
    const loggedIn = localStorage.getItem('username') ? true : false;
    const header = document.querySelector('header');

    const nav = document.createElement('nav');
    nav.classList = 'nav-container flex flex-wrap md:flex-nowrap gap-4 justify-between items-center p-4 bg-white shadow';

    // LEFT: Menu
    const menuWrapper = document.createElement('div');
    menuWrapper.className = 'menu-wrapper w-full md:w-auto md:flex hidden flex-col md:flex-row gap-2 sm:gap-4 mt-2 md:mt-0 items-start md:items-center';

    const menu = document.createElement('div');
    menu.classList = 'menu flex flex-col md:flex-row gap-2 sm:gap-4';

    const feedButton = document.createElement('button');
    feedButton.textContent = 'Feed';
    feedButton.className = 'text-white bg-Blue_Chill px-4 py-2 rounded hover:bg-Blue_Chill/80 transition';
    feedButton.addEventListener('click', () => {
        window.location.href = '../index.html';
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
        logoutButton.classList = 'logout_button text-white bg-Blue_Chill px-4 py-2 rounded hover:bg-Blue_Chill/80 transition';
        logoutButton.textContent = 'Logout';
        logoutButton.addEventListener('click', function () {
            logout();
        });

        menu.appendChild(profileButton);
        menu.appendChild(logoutButton);
    } else {
        const loginButton = document.createElement('button');
        loginButton.classList = 'login_button text-white bg-Blue_Chill px-4 py-2 rounded hover:bg-Blue_Chill/80 transition';
        loginButton.textContent = 'Sign in';
        loginButton.addEventListener('click', function () {
            window.location.href = '../auth/login.html';
        });

        const registerButton = document.createElement('button');
        registerButton.classList = 'register_button text-white bg-Blue_Chill px-4 py-2 rounded hover:bg-Blue_Chill/80 transition';
        registerButton.textContent = 'Sign up';
        registerButton.addEventListener('click', function () {
            window.location.href = '../auth/register.html';
        });

        menu.appendChild(loginButton);
        menu.appendChild(registerButton);
    }

    menuWrapper.appendChild(menu);

    // RIGHT: Search bar
    const searchForm = document.createElement('form');
    searchForm.classList = 'search-form w-full md:w-auto flex flex-wrap sm:flex-nowrap items-center gap-2';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';
    searchInput.classList = 'sm:w-40 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-Blue_Chill';

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
            const searchEvent = new CustomEvent('search', {
                detail: { query }
            });
            document.dispatchEvent(searchEvent);
        }
    });


    // LEFT: Hamburger Button
    const burgerButton = document.createElement('button');
    burgerButton.innerHTML = '&#9776;'; // ☰ ikon
    burgerButton.setAttribute('aria-label', 'Toggle menu');
    burgerButton.className = 'block md:hidden text-3xl text-Blue_Chill';

    // Toggle menu visibility
    burgerButton.addEventListener('click', () => {
        menuWrapper.classList.toggle('hidden');
    });

    // Append all elements to nav
    nav.appendChild(burgerButton);
    nav.appendChild(menuWrapper);
    nav.appendChild(searchForm);
    header.appendChild(nav);
}

createHeader();
