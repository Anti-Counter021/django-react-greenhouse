export default class Services {

    _url = 'http://localhost:8000/'
    _token = '9034236dfd85f611292c77b81a8c41613da7abfd'

    async getData(url, token='') {
        const res = await fetch(this._url + url, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
            }
        });

        if (!res.ok) {
            throw new Error(`Ошибка ${url}, статус = ${res.status}`);
        }

        return await res.json();
    }

    getProducts = async () => {
        return await this.getData('products/', this._token);
    }

}
