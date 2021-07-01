import React, {useEffect} from "react";

import {connect} from "react-redux";
import {Link} from "react-router-dom";

import Navbar from "../navbar/navbar";
import WithServices from "../hoc/with_services";
import {setUserIsAuthenticated} from "../../redux/action";
import GetTokenFromLocalStorage, {SetTokenToLocalStorage} from "../../services/token_from_localstorage";

import "./login.scss";


/* Авторизация */

const Login = ({userIsAuthenticated, Services, setUserIsAuthenticated}) => {

    useEffect(() => {
        if (userIsAuthenticated && GetTokenFromLocalStorage()) {
            window.location.href = '/';
        }
    });

    const login = (e) => {
        /* Авторизация */

        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        Services.loginUser(data)
            .then(res => {
                SetTokenToLocalStorage(res.token);
                setUserIsAuthenticated(true);
            })
            .catch(error => document.querySelector('.error').style.display = 'block');
    }

    return (
        <>
            <Navbar active="login"/>
            <section className="login__section">
                <div className="container">
                    <div className="login__header">Авторизация</div>
                    <div style={{display: 'none'}} className="error">
                        Неправильное имя пользователя или пароль!
                    </div>
                    <div className="login">
                        <form className="login__form" onSubmit={login}>
                            <div className="login__form__group">
                                <label htmlFor="username">
                                    Имя пользователя<span className="required">*</span>
                                </label>
                                <input
                                    required
                                    name="username"
                                    className="login__form__input"
                                    id="username"
                                    type="text"
                                    placeholder="Имя пользователя"
                                />
                            </div>

                            <div className="login__form__group">
                                <label htmlFor="password">
                                    Пароль<span className="required">*</span>
                                </label>
                                <input
                                    required
                                    name="password"
                                    className="login__form__input"
                                    id="password"
                                    type="password"
                                    placeholder="Пароль"
                                />
                            </div>

                            <button
                                style={{width: '25%'}}
                                className="buttons buttons__success login__form__btn"
                                type="submit">
                                Авторизоваться
                            </button>

                        </form>
                        <Link to="/register">
                            <button style={{width: '25%'}} className="buttons buttons__success" type="submit">
                                Зарегистрироваться
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );

};

const mapStateToProps = (state) => {
    return {
        userIsAuthenticated: state.userIsAuthenticated,
    };
};

const mapDispatchToProps = {
    setUserIsAuthenticated,
};

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(Login));
