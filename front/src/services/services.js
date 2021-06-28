/* Запросы на сервер */

import host from "./host";

export default class Services {

    _url = `${host}/api/`

    async getData(url, token='') {
        /* GET запросы */

        const token_auth = token ? {'Authorization': `Token ${token}`} : {};
        const res = await fetch(this._url + url, {
            method: 'GET',
            headers: {
                ...token_auth,
            },
        });

        if (!res.ok) {
            throw new Error(`Ошибка ${url}, статус = ${res.status}`);
        }

        return await res.json();
    }

    async postData(url, data, token='') {
        /* POST запросы */

        const token_auth = token ? {'Authorization': `Token ${token}`} : {};
        const res = await fetch(this._url + url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                ...token_auth,
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            console.log(res)
            throw new Error(`Ошибка ${url}, статус = ${res.status}`);
        }

        return await res.json();
    }

    async deleteData(url, token = '') {
        /* DELETE запросы */

        const token_auth = token ? {'Authorization': `Token ${token}`} : {};
        const res = await fetch(this._url + url, {
            method: 'DELETE',
            headers: {
                ...token_auth,
            },
        });

        if (!res.ok) {
            console.log(res)
            throw new Error(`Ошибка ${url}, статус = ${res.status}`);
        }

        return await res.json();
    }

    async changeData(url, token='') {
        /* PUT запросы */
        const token_auth = token ? {'Authorization': `Token ${token}`} : {};
        const res = await fetch(this._url + url, {
            method: 'PUT',
            headers: {
                ...token_auth,
            },
        });

        if (!res.ok) {
            console.log(res)
            throw new Error(`Ошибка ${url}, статус = ${res.status}`);
        }

        return await res.json();
    }

    /* GET */

    getProducts = async () => {
        return await this.getData('products/');
    }

    getNewProduct = async () => {
        return await this.getData('new-product');
    }

    getCategoryProducts = async () => {
        return await this.getData('categories');
    }

    getProductDetail = async (slug) => {
        return await this.getData(`products/${slug}`)
    }

    /* Корзина */

    getUserCart = async (token) => {
        return await this.getData('cart', token);
    }

    addNewProductInCart = async (productId, token) => {
        return await this.postData(`cart/add/${productId}`, '', token);
    }

    deleteProductFromCart = async (cartProductId, token) => {
        return await this.deleteData(`cart/remove/${cartProductId}`, token);
    }

    changeProductQTYFromCart = async (cartProductId, qty, token) => {
        return await this.changeData(`cart/change-qty/${cartProductId}/${qty}`, token);
    }

    /* Пользователь */

    userIsAuthenticated = async (token) => {
        return await this.getData('auth/user', token);
    }

    logoutUser = async (token) => {
        return await this.getData('auth/logout', token);
    }

    loginUser = async (data) => {
        return await this.postData('auth/token', data);
    }

    registerUser = async (data) => {
        return await this.postData('auth/register', data);
    }

}
