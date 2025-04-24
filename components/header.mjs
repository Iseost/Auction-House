import { logout } from '../components/logout.mjs';

function createHeader() {
    const loggedIn = localStorage.getItem('username') ? true : false;
    const header = document.querySelector('header');

    const nav = document.createElement('nav');
    nav.classList = 'nav-container';

    const menu = document.createElement('div');
    menu.classList = 'menu flex gap-4';

    // Always show Feed button
    const feedButton = document.createElement('a');
    feedButton.href = '../feed/feed.html';
    feedButton.textContent = 'Feed';
    menu.appendChild(feedButton);

    if (loggedIn) {
        // Show Profile and Logout only if logged in
        const profileButton = document.createElement('a');
        profileButton.href = `../profile/profile.html?username=${localStorage.getItem('username')}`;
        profileButton.textContent = 'Profile';

        const logoutButton = document.createElement('button');
        logoutButton.classList = 'logout_button';
        logoutButton.textContent = 'Logout';
        logoutButton.addEventListener('click', function () {
            logout();
        });

        menu.appendChild(profileButton);
        menu.appendChild(logoutButton);
    } else {
        // Show Login and Register only if NOT logged in
        const loginButton = document.createElement('button');
        loginButton.classList = 'login_button';
        loginButton.textContent = 'Sign in';
        loginButton.addEventListener('click', function () {
            window.location.href = '../auth/login.html';
        });

        const registerButton = document.createElement('button');
        registerButton.classList = 'register_button';
        registerButton.textContent = 'Sign up';
        registerButton.addEventListener('click', function () {
            window.location.href = '../auth/register.html';
        });

        menu.appendChild(loginButton);
        menu.appendChild(registerButton);
    }

    nav.appendChild(menu);
    header.appendChild(nav);
}

createHeader();

