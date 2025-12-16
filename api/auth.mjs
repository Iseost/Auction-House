
import { API_AUTH_LOGIN } from '../constants.mjs';
import { API_AUTH_REGISTER } from '../constants.mjs';

export async function register(email, password, name) {
    try {
        const data = await fetch(API_AUTH_REGISTER, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });


        if (data.status === 201) {
            alert('Welcome! You will now be sent back to the login.')
            window.location.replace('../index.html');
        } else {
            document.getElementById('error_message_register').textContent = 'Make sure that your email is a stud.noroff mail and your password has 8 character.'
        }
    } catch (error) {
        console.error('Registration error:', error);
        document.getElementById('error_message_register').textContent = 'An error occurred during registration. Please try again.';
    }

}


export async function login(email, password) {
    try {
        const data = await fetch(API_AUTH_LOGIN, {
            method: 'post',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });



        if (data.status === 200) {
            const tech = await data.json();
            const token = tech.data.accessToken;
            const name = tech.data.name;
            localStorage.setItem('accessToken', token);
            localStorage.setItem('username', name);
            window.location.replace('../index.html');
        } else {
            document.getElementById('error_message_login').textContent = 'Failed to login. Email address or password is wrong. Please try again'
        }
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('error_message_login').textContent = 'An error occurred during login. Please try again.';
    }

}