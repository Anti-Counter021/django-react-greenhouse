import React, {useEffect} from "react";

import {connect} from "react-redux";

import Navbar from "../navbar/navbar";
import WithServices from "../hoc/with_services";
import {setUserIsAuthenticated} from "../../redux/action";
import GetTokenFromLocalStorage, {SetTokenToLocalStorage} from "../../services/token_from_localstorage";

import "./register.scss";


/* Регистрация */

const Register = ({Services, setUserIsAuthenticated, userIsAuthenticated}) => {

    useEffect(() => {
        if (userIsAuthenticated && GetTokenFromLocalStorage()) {
            window.location.href = '/';
        }
    });

    const register = (e) => {
        /* Регистрация */

        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        Services.registerUser(data)
            .then(res => {
                if (res.error) {
                    const errorDiv = document.createElement('div');
                    errorDiv.classList.add('error');
                    errorDiv.textContent = res.error;
                    document.querySelector('.register').insertBefore(errorDiv, e.target);
                } else if (res.success) {
                    Services.loginUser(data)
                        .then(res => {
                            SetTokenToLocalStorage(res.token);
                            setUserIsAuthenticated(true);
                        })
                        .catch(error => {
                            console.log(error);
                            alert('Произошла ошибка...');
                        })
                }
            })
            .catch(error => {
                console.log(error);
                alert('Произошла ошибка...');
            });
    };

    return (
        <>
            <Navbar active="login"/>
            <section className="register__section">
                <div className="container">
                    <div className="register__header">Регистрация</div>
                    <div className="register">
                        <form className="register__form" onSubmit={register}>
                            <div className="register__form__group">
                                <label htmlFor="username">
                                    Имя пользователя<span className="required">*</span>
                                </label>
                                <input
                                    required
                                    name="username"
                                    className="register__form__input"
                                    id="username"
                                    type="text"
                                    placeholder="Имя пользователя"
                                />
                            </div>

                            <div className="register__form__group">
                                <label htmlFor="first_name">Имя<span className="required">*</span></label>
                                <input
                                    required
                                    name="first_name"
                                    className="register__form__input"
                                    id="first_name"
                                    type="text"
                                    placeholder="Имя"
                                />
                            </div>

                            <div className="register__form__group">
                                <label htmlFor="last_name">Фамилия<span className="required">*</span></label>
                                <input
                                    required
                                    name="last_name"
                                    className="register__form__input"
                                    id="last_name"
                                    type="text"
                                    placeholder="Фамилия"
                                />
                            </div>

                            <div className="register__form__group">
                                <label htmlFor="email">Адрес эл. почты<span className="required">*</span></label>
                                <input
                                    required
                                    name="email"
                                    className="register__form__input"
                                    id="email"
                                    type="email"
                                    placeholder="Адресс эл. почты"
                                />
                            </div>

                            <div className="register__form__group">
                                <label htmlFor="phone">Телефон<span className="required">*</span></label>
                                <input
                                    required
                                    name="phone"
                                    className="register__form__input"
                                    id="phone"
                                    type="text"
                                    placeholder="Телефон"
                                />
                            </div>

                            <div className="register__form__group">
                                <label htmlFor="address">Адрес<span className="required">*</span></label>
                                <input
                                    required
                                    name="address"
                                    className="register__form__input"
                                    id="address"
                                    type="text"
                                    placeholder="Адрес"
                                />
                            </div>

                            <div className="register__form__group">
                                <label htmlFor="password">Пароль<span className="required">*</span></label>
                                <input
                                    required
                                    name="password"
                                    className="register__form__input"
                                    id="password"
                                    type="password"
                                    placeholder="Пароль"
                                />
                                <ul className="password__help">
                                    <li>Пароль не должен быть слишком похож на другую вашу личную информацию.</li>
                                    <li>Ваш пароль должен содержать как минимум 8 символов.</li>
                                    <li>Пароль не может состоять только из цифр.</li>
                                </ul>
                            </div>

                            <div className="register__form__group">
                                <label htmlFor="confirm_password">Повторите пароль<span
                                    className="required">*</span></label>
                                <input
                                    required
                                    name="confirm_password"
                                    className="register__form__input"
                                    id="confirm_password"
                                    type="password"
                                    placeholder="Повторите пароль"
                                />
                            </div>

                            <button
                                style={{width: '25%'}}
                                className="buttons buttons__success register__form__btn"
                                type="submit">
                                Зарегистрироваться
                            </button>

                        </form>
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

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(Register));
