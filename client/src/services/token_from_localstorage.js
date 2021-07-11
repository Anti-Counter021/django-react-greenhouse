/* Работа с токеном пользователя */

export default function GetTokenFromLocalStorage() {
    /* Получение */

    return localStorage.getItem('token') || '';
}

export function SetTokenToLocalStorage(token) {
    /* Установка */

    localStorage.setItem('token', token);
    window.location.href = '/';
}

export function DeleteTokenFromLocalStorage() {
    /* Удаление */

    localStorage.removeItem('token');
}
