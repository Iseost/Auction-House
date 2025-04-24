import { logout } from '../components/logout.mjs';

function createHeader() {

    const loggedIn = localStorage.getItem('username') ? true : false;
    const header = document.querySelector('header');

    const nav = document.createElement('nav');
    nav.classList = 'nav-container';

    //menu

    const menu = document.createElement('div');
    menu.classList = 'menu flex';

    const profileButton = document.createElement('a');
    profileButton.href = '../profile/profile.html?username=' + localStorage.getItem('username');
    profileButton.textContent = 'Profile';

    const feedButton = document.createElement('a');
    feedButton.href = '../feed/feed.html';
    feedButton.textContent = 'Feed';

    menu.appendChild(profileButton);
    menu.appendChild(feedButton);

    //Logout button

    if (loggedIn) {
        const logoutButton = document.createElement('button');
        logoutButton.classList = 'logout_button';
        logoutButton.textContent = 'Logout';
        logoutButton.addEventListener('click', function () {
            logout();
        });
        nav.appendChild(logoutButton);
    }

    nav.appendChild(menu);
    header.appendChild(nav);
}

createHeader();
