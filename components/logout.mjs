const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

export async function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    window.location.replace('../index.html');
}