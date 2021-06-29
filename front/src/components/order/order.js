import React, {Component} from "react";

import {connect} from "react-redux";
import {Link} from "react-router-dom";
import DatePicker from "react-datepicker";

import Navbar from "../navbar/navbar";
import host from "../../services/host";
import Spinner from "../spinner/spinner";
import WithServices from "../hoc/with_services";
import {cartError, cartLoaded, cartRequested, orderDate} from "../../redux/action";
import GetTokenFromLocalStorage from "../../services/token_from_localstorage";

import "./order.scss";


class Order extends Component {

    componentDidMount() {
        const {Services, cartLoaded, cartRequested, cartError} = this.props;

        cartRequested();
        Services.getUserCart(GetTokenFromLocalStorage()).then(data => cartLoaded(data)).catch(error => cartError());
    }

    createOrder = (e) => {
        e.preventDefault();
        document.querySelector('.order__form__btn').style.opacity = '0';

        const {Services} = this.props;
        const data = Object.fromEntries(new FormData(e.target).entries());

        Services.makeOrder(data, GetTokenFromLocalStorage())
            .then(res => {
                alert(res.detail);
                if (!res.error) {
                    window.location.href = '/';
                }

                document.querySelector('.order__form__btn').style.opacity = '1';
            })
            .catch(error => {
                alert('Произошла ошибка...');
                console.log(error);
                document.querySelector('.order__form__btn').style.opacity = '1';
            });
    }

    render() {

        const {orderDate, date, loading, error, cart: {for_anonymous_user, final_price}} = this.props;
        let {products} = this.props.cart;

        if (!products) {
            products = [];
        }

        if (loading) {
            return (
                <>
                    <Navbar active='cart'/>
                    <Spinner/>
                </>
            )
        }

        if (error) {
            alert('Произошла ошибка...');
        }

        return (
            <>
                <Navbar active='cart'/>
                <section className="order">
                    <div className="container">
                        {!for_anonymous_user && products.length ? (
                            <>
                                <table className="table">
                                    <thead>
                                        <tr className="order__table__header">
                                            <th>Товар</th>
                                            <th>Количество</th>
                                            <th className="order__table__image__header">Изображение</th>
                                            <th>Цена</th>
                                            <th>Общая цена</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products ? (
                                            products.map(({id, qty, price, final_price, product: {title, image}}) => (
                                                <tr key={id} className="order__table__body">
                                                    <td className="order__table__title">{title}</td>
                                                    <td style={{textAlign: 'center'}} className="order__table__qty">
                                                        {qty} шт.
                                                    </td>

                                                    <td className="order__table__image">
                                                        <img
                                                            className="order__table__image__content"
                                                            src={host + image}
                                                            alt={title}/></td>
                                                    <td className="order__table__price">{price} руб.</td>

                                                    <td id={"order_product_" + id} className="order__table__price">
                                                        {final_price} руб.
                                                    </td>

                                                </tr>
                                                ))
                                            ): null
                                        }
                                    </tbody>
                                </table>
                                <div className="order__total">
                                    <div className="order__total__label">Итого:</div>
                                    <div id="order__total__price" className="order__total__price">
                                        {final_price} руб.
                                    </div>
                                </div>

                                <form className="order__form" onSubmit={this.createOrder}>
                                    <div className="order__form__group">
                                        <label htmlFor="first_name">
                                            Имя<span className="required">*</span>
                                        </label>
                                        <input
                                            required
                                            name="first_name"
                                            className="order__form__input"
                                            id="first_name"
                                            type="text"
                                            placeholder="Имя"
                                        />
                                    </div>
                                    <div className="order__form__group">
                                        <label htmlFor="last_name">
                                            Фамилия<span className="required">*</span>
                                        </label>
                                        <input
                                            required
                                            name="last_name"
                                            className="order__form__input"
                                            id="last_name"
                                            type="text"
                                            placeholder="Фамилия"
                                        />
                                    </div>

                                    <div className="order__form__group">
                                        <label htmlFor="phone">
                                            Телефон<span className="required">*</span>
                                        </label>
                                        <input
                                            required
                                            name="phone"
                                            className="order__form__input"
                                            id="phone"
                                            type="text"
                                            placeholder="Телефон"
                                        />
                                    </div>

                                    <div className="order__form__group">
                                        <label htmlFor="address">
                                            Адрес<span className="required">*</span>
                                        </label>
                                        <input
                                            required
                                            name="address"
                                            className="order__form__input"
                                            id="address"
                                            type="text"
                                            placeholder="Адрес "
                                        />
                                    </div>

                                    <div className="order__form__group">
                                        <label htmlFor="buying_type">
                                            Тип заказа
                                        </label>
                                        <select
                                            name="buying_type"
                                            className="order__form__input"
                                            id="buying_type"
                                        >
                                            <option>Самовывоз</option>
                                            <option>Доставка</option>
                                        </select>
                                    </div>

                                    <div className="order__form__group">
                                        <label htmlFor="order_date">
                                            Желаемая дата получения заказа<span className="required">*</span>
                                        </label>
                                    </div>
                                    <DatePicker
                                        selected={date}
                                        name="order_date"
                                        id="order_date"
                                        dateFormat="dd/MM/yyyy"
                                        className="order__form__input"
                                        placeholder="Желаемая дата получения заказа"
                                        onChange={(e) => orderDate(e)}
                                    />

                                    <div className="order__form__group">
                                        <label htmlFor="comment">
                                            Комментарий
                                        </label>
                                        <input
                                            name="comment"
                                            className="order__form__input"
                                            id="comment"
                                            type="text"
                                            placeholder="Комментарий"
                                        />
                                    </div>

                                    <button
                                        style={{width: '25%'}}
                                        className="buttons buttons__success order__form__btn"
                                        type="submit">
                                            Оформить заказ
                                    </button>

                                </form>
                            </>
                        ) : (!for_anonymous_user ? (
                            <div className="for_anonymous_user_or_not_products">
                                Для оформления заказа необходимо совершить покупки
                            </div>
                        ) : (
                            <div className="for_anonymous_user_or_not_products">
                                Для оформления заказа необходимо <Link to="/login">авторизироваться</Link>
                            </div>
                        ))}

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
        date: state.date,
    };
};

const mapDispatchToProps = {
    cartLoaded,
    cartRequested,
    cartError,
    orderDate,
};

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(Order));
