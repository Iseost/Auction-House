import { register, login } from '../api/auth.mjs';

document.getElementById('register_button').addEventListener('click', async function () {
    const email = document.getElementById('register_email').value;
    const password = document.getElementById('register_password').value;
    const name = document.getElementById('register_username').value;

    register(email, password, name);
});

document.getElementById('login').addEventListener('click', async function () {
    const email = document.getElementById('login_email').value; // Get the email from the input field
    const password = document.getElementById('login_password').value; // Get the password from the input field              
    login(email, password); // Call the login function with the email and password as arguments
});