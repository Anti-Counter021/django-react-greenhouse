export default class Services {

    _url = 'http://localhost:8000/'
    _token = '9034236dfd85f611292c77b81a8c41613da7abfd'

    async getData(url, token='') {
        const token_auth = token ? {'Authorization': `Token ${token}`} : {};
        const res = await fetch(this._url + url, {
            method: 'GET',
            headers: {
                ...token_auth,
            }
        });

        if (!res.ok) {
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

    getGreenhouses = async () => {
        return await this.getData('greenhouses');
    }

    getCategoryProducts = async () => {
        return await this.getData('categories');
    }

}
