import React, {Component} from "react";

import Moment from "react-moment";
import {connect} from "react-redux";

import Error from "../error/error";
import Navbar from "../navbar/navbar";
import Spinner from "../spinner/spinner";
import WithServices from "../hoc/with_services";
import {ordersRequested, ordersError, ordersLoaded} from "../../redux/action";
import GetTokenFromLocalStorage from "../../services/token_from_localstorage";

import "./profile.scss";


/* Профиль */

class Profile extends Component {

    componentDidMount() {
        const {Services, ordersRequested, ordersError, ordersLoaded, userIsAuthenticated} = this.props;
        if (!userIsAuthenticated) {
            window.location.href = '/';
        }
        ordersRequested();
        Services.getUserProfile(GetTokenFromLocalStorage())
            .then(res => ordersLoaded(res))
            .catch(error => ordersError());
    }

    render() {

        const {loading, error, orders} = this.props;

        if (loading) {
            return (
                <>
                    <Navbar active="profile"/>
                    <Spinner/>
                </>
            );
        }

        if (error) {
            return <Error/>;
        }

        return (
            <>
                <Navbar active="profile"/>
                <section className="profile">
                    <div className="container">
                        <div className="profile__header">Профиль</div>
                        {orders && orders.length ? (
                            <table className="table">
                                <thead>
                                    <tr className="profile__table__header">
                                        <th>ID заказа</th>
                                        <th>Товар и количество</th>
                                        <th>Цена</th>
                                        <th>Общая цена</th>
                                        <th>Желаемая дата и способ получения</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orders.map(({id, order_date, buying_type, cart: {products, final_price}}) => (
                                            <tr key={id} className="profile__table__body">
                                                <td className="profile__table__id">{id}</td>
                                                <td className="profile__table__title">
                                                    <ul>
                                                        {
                                                            products.map(({qty, id, product: {title}}) => (
                                                                <li key={id} style={{margin: '10px'}}>
                                                                    {title} x {qty}
                                                                </li>
                                                            ))
                                                        }
                                                    </ul>
                                                </td>
                                                <td className="profile__table__price">
                                                    <ul>
                                                        {
                                                            products.map(({price, id}) => (
                                                                <li key={id} style={{margin: '10px'}}>
                                                                    {price} руб.
                                                                </li>
                                                            ))
                                                        }
                                                    </ul>
                                                </td>

                                                <td className="profile__table__price">
                                                    {final_price} руб.
                                                </td>

                                                <td className="profile__table__date__buying_type">
                                                    {
                                                        <Moment date={order_date} format="DD.MM.YYYY"/>
                                                    }, {buying_type}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        ) : (
                            <div className="for_anonymous_user_or_not_products">
                                Вам необходимо совершить покупки, чтобы появились заказы
                            </div>
                        )}
                    </div>
                </section>
            </>
        );

    }
}


const mapStateToProps = (state) => {
    return {
        error: state.error,
        loading: state.loading,
        orders: state.orders,
        userIsAuthenticated: state.userIsAuthenticated,
    };
};

const mapDispatchToProps = {
    ordersRequested,
    ordersError,
    ordersLoaded,
};

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(Profile));
