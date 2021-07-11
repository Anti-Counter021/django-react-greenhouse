import React, {Component} from "react";

import {connect} from "react-redux";

import Error from "../error/error";
import Navbar from "../navbar/navbar";
import Spinner from "../spinner/spinner";
import WithServices from "../hoc/with_services";
import GetTokenFromLocalStorage from "../../services/token_from_localstorage";
import {userChangeRequested, userChangeLoaded, userChangeError} from "../../redux/action";

import "./profile_change.scss";


/* Изменение данных пользователя */

class ProfileChange extends Component {

    loadingUser = (data = '', method = 'GET') => {
        const {Services, userChangeRequested, userChangeLoaded, userChangeError} = this.props;
        Services.profileChangeRequest(GetTokenFromLocalStorage(), data, method)
            .then(res => {
                if (typeof res.email === 'object' && !res.email[0].match(/@/)) {
                    const errorDiv = document.createElement('div');
                    errorDiv.classList.add('error');
                    errorDiv.textContent = 'Эта почта уже занята, попробуйте другую!';
                    document.querySelector('.profile__change')
                        .insertBefore(errorDiv, document.querySelector('.profile__change__form'));
                } else {
                    userChangeRequested();
                    userChangeLoaded(res);
                }
                if (data && typeof res.email !== 'object') {
                    alert('Ваши данные были изменены');
                }
            })
            .catch(error => userChangeError());
    }

    componentDidMount() {
        if (!this.props.userIsAuthenticated && !GetTokenFromLocalStorage()) {
            window.location.href = '/';
        }
        this.loadingUser();
    }

    changeData = (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        this.loadingUser(data, 'PUT');
    }

    render() {

        const {loading, error, userData: {first_name, last_name, phone, address, email}} = this.props;

        if (error) {
            return (
                <>
                    <Navbar active="profile"/>
                    <Error/>
                </>
            );
        }

        if (loading) {
            return (
                <>
                    <Navbar active="profile"/>
                    <Spinner/>
                </>
            );
        }

        return (
            <>
                <Navbar active="profile"/>
                <section className="profile__change__section">
                    <div className="container">
                        <div className="profile__change__header">Смена данных пользователя</div>
                        <div className="profile__change">
                            <form className="profile__change__form" onSubmit={this.changeData}>
                                <div className="profile__change__form__group">
                                    <label htmlFor="first_name">Имя<span className="required">*</span></label>
                                    <input
                                        defaultValue={first_name}
                                        required
                                        name="first_name"
                                        className="profile__change__form__input"
                                        id="first_name"
                                        type="text"
                                        placeholder="Имя"
                                    />
                                </div>

                                <div className="profile__change__form__group">
                                    <label htmlFor="last_name">Фамилия<span className="required">*</span></label>
                                    <input
                                        defaultValue={last_name}
                                        required
                                        name="last_name"
                                        className="profile__change__form__input"
                                        id="last_name"
                                        type="text"
                                        placeholder="Фамилия"
                                    />
                                </div>

                                <div className="profile__change__form__group">
                                    <label htmlFor="email">Адрес эл. почты<span className="required">*</span></label>
                                    <input
                                        defaultValue={email}
                                        required
                                        name="email"
                                        className="profile__change__form__input"
                                        id="email"
                                        type="email"
                                        placeholder="Адресс эл. почты"
                                    />
                                </div>

                                <div className="profile__change__form__group">
                                    <label htmlFor="phone">Телефон<span className="required">*</span></label>
                                    <input
                                        defaultValue={phone}
                                        required
                                        name="phone"
                                        className="profile__change__form__input"
                                        id="phone"
                                        type="text"
                                        placeholder="Телефон"
                                    />
                                </div>

                                <div className="profile__change__form__group">
                                    <label htmlFor="address">Адрес<span className="required">*</span></label>
                                    <input
                                        defaultValue={address}
                                        required
                                        name="address"
                                        className="profile__change__form__input"
                                        id="address"
                                        type="text"
                                        placeholder="Адрес"
                                    />
                                </div>

                                <button
                                    style={{width: '25%'}}
                                    className="buttons buttons__success profile__change__form__btn"
                                    type="submit">
                                        Изменить данные
                                </button>

                            </form>
                        </div>
                    </div>
                </section>
            </>
        );

    }

}

const mapStateToProps = (state) => {
    return {
        loading: state.loadingUser,
        error: state.errorUser,
        userData: state.userData,
        userIsAuthenticated: state.userIsAuthenticated,
    };
};

const mapDispatchToProps = {
    userChangeRequested,
    userChangeLoaded,
    userChangeError,
};

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(ProfileChange));
