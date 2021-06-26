export default function GetTokenFromLocalStorage() {
    return localStorage.getItem('token') || '';
}

export function SetTokenToLocalStorage(token) {
    localStorage.setItem('token', token);
    window.location.href = '/';
}
