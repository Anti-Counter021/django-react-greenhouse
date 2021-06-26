import React, {Component} from "react";

import {Link} from "react-router-dom";

import Navbar from "../navbar/navbar";
import WithServices from "../hoc/with_services";
import GetTokenFromLocalStorage, {SetTokenToLocalStorage} from "../../services/get_token_from_localstorage";

import "./login.scss";


class Login extends Component {

    componentDidMount() {
        const {Services} = this.props;
        Services.userIsAuthenticated(GetTokenFromLocalStorage())
            .then(res => res.is_authenticated ? window.location.href = '/' : '')
            .catch(error => console.log(error));
    }

    login = (e) => {
        e.preventDefault();
        const {Services} = this.props;
        const data = Object.fromEntries(new FormData(e.target).entries());
        Services.loginUser(data)
            .then(res => SetTokenToLocalStorage(res.token))
            .catch(error => document.querySelector('.error').style.display = 'block');
    }

    render() {

        return (
            <>
                <Navbar active="Вход / Регистрация"/>
                <section className="login__section">
                    <div className="container">
                        <div className="login__header">Авторизация</div>
                        <div style={{display: 'none'}} className="error">Неправильное имя пользователя или пароль!</div>
                        <div className="login">
                            <form className="login__form" onSubmit={this.login}>
                                <div className="login__form__group">
                                    <label htmlFor="username">Имя пользователя<span
                                        className="required">*</span></label>
                                    <input required name="username" className="login__form__input" id="username" type="text"
                                           placeholder="Имя пользователя"/>
                                </div>

                                <div className="login__form__group">
                                    <label htmlFor="password">Пароль<span className="required">*</span></label>
                                    <input required name="password" className="login__form__input" id="password" type="password"
                                           placeholder="Пароль"/>
                                </div>

                                <button style={{width: '25%'}} className="buttons buttons__success login__form__btn"
                                        type="submit">
                                    Авторизоваться
                                </button>

                            </form>
                            <Link to="/register">
                                <button style={{width: '25%'}} className="buttons buttons__success"
                                        type="submit">
                                    Зарегистрироваться
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </>
        );

    }

}


export default WithServices()(Login);
