export default class Services {

    _url = 'http://localhost:8000/api/'

    async getData(url, token='') {
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

    async deleteData(url, token='') {
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

    getUserCart = async (token) => {
        return await this.getData('cart', token);
    }

    addNewProductInCart = async (productId, token) => {
        return await this.postData(`cart/add/${productId}`, '', token);
    }

    deleteProductFromCart = async (cartProductId, token) => {
        return await this.deleteData(`cart/remove/${cartProductId}`, token);
    }

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
