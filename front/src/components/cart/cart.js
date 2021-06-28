import React, {Component} from "react";

import {connect} from "react-redux";
import {Link} from "react-router-dom";

import Navbar from "../navbar/navbar";
import host from "../../services/host";
import Spinner from "../spinner/spinner";
import WithServices from "../hoc/with_services";
import GetTokenFromLocalStorage from "../../services/get_token_from_localstorage";
import {cartRequested, cartError, cartLoaded} from "../../redux/action";

import "./cart.scss";


class Cart extends Component {

    loadCart = () => {
        const {Services, cartLoaded, cartRequested, cartError} = this.props;
        cartRequested();
        Services.getUserCart(GetTokenFromLocalStorage()).then(data => cartLoaded(data)).catch(error => cartError());
    }

    componentDidMount() {
        this.loadCart();
    }

    removeFromCart = (cartProductId) => {
        const {Services} = this.props;
        const success = document.querySelector('.success');
        Services.deleteProductFromCart(cartProductId, GetTokenFromLocalStorage())
            .then(res => {
                success.textContent = res.detail;
                success.style.display = 'block';
                setTimeout(() => this.loadCart(), 1500);
            })
            .catch(error => document.querySelector('.error').style.display = 'block');
    }

    changeQTYFromCart = (e, cartProductId) => {
        const {Services} = this.props;
        const success = document.querySelector('.success');
        Services.changeProductQTYFromCart(cartProductId, e.target.value, GetTokenFromLocalStorage())
            .then(res => {
                success.textContent = res.detail;
                success.style.display = 'block';
                setTimeout(() => success.style.display = 'none', 1000);
                document.querySelector(`#cart_product_${cartProductId}`).textContent = res.final_price + ' руб.';
                document.querySelector('#cart__total__price').textContent = res.cart_price + ' руб.';
            })
            .catch(error => document.querySelector('.error').style.display = 'block');
    }

    render() {

        const {loading, error, cart: {for_anonymous_user, final_price}} = this.props;
        let {products} = this.props.cart;

        if (!products) {
            products = [];
        }

        if (loading) {
            return <Spinner/>
        }

        if (error) {
            document.querySelector('.error').style.display = 'block';
        }

        return (
            <>
                <Navbar active='cart'/>
                <section className="cart">
                    <div className="container">
                        <div style={{display: 'none'}} className="error">Произошла ошибка...</div>
                        <div style={{display: 'none'}} className="success">Товар успешно удалён</div>
                        {!for_anonymous_user && products.length ? (
                            <>
                                <table className="table">
                                    <thead>
                                        <tr className="cart__table__header">
                                            <th>Товар</th>
                                            <th>Количество</th>
                                            <th className="cart__table__image__header">Изображение</th>
                                            <th>Цена</th>
                                            <th>Общая цена</th>
                                            <th>Действие</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products ? (
                                            products.map(({id, qty, price, final_price, product: {title, image}}) => (
                                                <tr key={id} className="cart__table__body">
                                                    <td className="cart__table__title">{title}</td>
                                                    <td className="cart__table__qty">
                                                        <input onChange={(e) => this.changeQTYFromCart(e, id)} className="cart__table__qty__input form-control" type="number" defaultValue={qty} min="1"/>
                                                    </td>
                                                    <td className="cart__table__image"><img className="cart__table__image__content"
                                                                                            src={host + image}
                                                                                            alt=""/></td>
                                                    <td className="cart__table__price">{price} руб.</td>
                                                    <td id={"cart_product_" + id} className="cart__table__price">{final_price} руб.</td>
                                                    <td>
                                                        <button onClick={() => this.removeFromCart(id)} className="buttons buttons__success">Удалить из корзины</button>
                                                    </td>
                                                </tr>
                                                ))
                                            ): null
                                        }
                                    </tbody>
                                </table>
                                <div className="cart__total">
                                    <div className="cart__total__label">Итого:</div>
                                    <div id="cart__total__price" className="cart__total__price">{final_price} руб.</div>
                                    <div className="cart__total__action">
                                        <button className="buttons buttons__success">Перейти к оформлению</button>
                                    </div>
                                </div>
                            </>
                        ) : (!for_anonymous_user ? (<div className="for_anonymous_user_or_not_products">Корзина пуста</div>) : (<div className="for_anonymous_user_or_not_products">Для покупок необходимо <Link to="/login">авторизироваться</Link></div>))}
                    </div>
                </section>
            </>
        );

    }

}


const mapStateToProps = (state) => {
    return {
        cart: state.cart,
        error: state.error,
        loading: state.loading,
    };
};

const mapDispatchToProps = {
    cartLoaded,
    cartRequested,
    cartError,
};

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(Cart));
