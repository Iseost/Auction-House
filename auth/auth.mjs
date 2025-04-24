import { register, login } from '../api/auth.mjs';

const registerButton = document.getElementById('register_button');
if (registerButton) {
    registerButton.addEventListener('click', async function () {
        const email = document.getElementById('register_email').value;
        const password = document.getElementById('register_password').value;
        const name = document.getElementById('register_username').value;
        register(email, password, name);
    });
}

const loginButton = document.getElementById('login');
if (loginButton) {
    loginButton.addEventListener('click', async function () {
        const email = document.getElementById('login_email').value;
        const password = document.getElementById('login_password').value;
        const name = document.getElementById('login_username').value;
        login(email, password, name);
    });
}
