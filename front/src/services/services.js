/* Запросы на сервер */

import host from "./host";

export default class Services {

    _url = `${host}/api/`

    async httpRequest(method, url, token='', data='') {
        const token_auth = token ? {'Authorization': `Token ${token}`} : {};
        const body_data = data ? {body: JSON.stringify(data)} : {};
        const res = await fetch(this._url + url, {
            method: method,
            headers: {
                'Content-type': 'application/json',
                ...token_auth,
            },
            ...body_data,
        });

        if (!res.ok) {
            throw new Error(`Ошибка ${url}, статус = ${res.status}`);
        }

        return await res.json();
    }

    /* GET */

    getProducts = async (page) => {
        return await this.httpRequest('GET', `products/?page=${page}`);
    }

    getNewProduct = async () => {
        return await this.httpRequest('GET', 'products/new-product');
    }

    getCategoryProducts = async () => {
        return await this.httpRequest('GET', 'categories');
    }

    getProductDetail = async (slug) => {
        return await this.httpRequest('GET', `products/${slug}`)
    }

    /* Отзывы */

    getReviews = async (page, filter) => {
        return await this.httpRequest('GET', `reviews/?${filter}&page=${page}`);
    }

    postReview = async (data, token) => {
        return await this.httpRequest('POST', 'reviews/add', token, data);
    }

    /* Баги */
    postFeedback = async (data) => {
        return await this.httpRequest('POST', 'feedback', '', data);
    }

    /* Корзина */

    getUserCart = async (token) => {
        return await this.httpRequest('GET', 'cart/get/', token);
    }

    addNewProductInCart = async (productId, token) => {
        return await this.httpRequest('POST',`cart/add/${productId}/`, token);
    }

    deleteProductFromCart = async (cartProductId, token) => {
        return await this.httpRequest('DELETE', `cart/remove/${cartProductId}/`, token);
    }

    changeProductQTYFromCart = async (cartProductId, qty, token) => {
        return await this.httpRequest('PUT', `cart/change-qty/${cartProductId}/${qty}/`, token);
    }

    makeOrder = async (data, token) => {
        return await this.httpRequest('POST', 'orders/', token, data);
    }

    /* Пользователь */

    userIsAuthenticated = async (token) => {
        return await this.httpRequest('GET', 'auth/user', token);
    }

    getUserProfile = async (token) => {
        return await this.httpRequest('GET', 'auth/profile', token);
    }

    logoutUser = async (token) => {
        return await this.httpRequest('GET', 'auth/logout', token);
    }

    loginUser = async (data) => {
        return await this.httpRequest('POST', 'auth/token', '', data);
    }

    registerUser = async (data) => {
        return await this.httpRequest('POST', 'auth/register', '', data);
    }

}
