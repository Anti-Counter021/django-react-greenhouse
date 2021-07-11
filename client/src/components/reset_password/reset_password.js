import React, {useEffect} from "react";

import {connect} from "react-redux";

import Navbar from "../navbar/navbar";
import WithServices from "../hoc/with_services";
import GetTokenFromLocalStorage from "../../services/token_from_localstorage";

import "./reset_password.scss";


const ResetPassword = ({Services, userIsAuthenticated}) => {

    useEffect(() => {
        const token = window.location.search.substring(1).split('=')[1] || 'token';
        Services.tokenIsTrue({token})
            .then(res => '')
            .catch(error => {
                console.log(error);
                alert('Неверный токен пользователя. Попробуйте отправить письмо для сброса пароля ещё раз!');
                window.location.href = '/password/reset/request';
            });
        if (userIsAuthenticated && GetTokenFromLocalStorage()) {
            window.location.href = '/';
        }
    });

    const resetPassword = async (event) => {
        const token = window.location.search.substring(1).split('=')[1];
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        data['token'] = token;
        const btn = document.querySelector('.reset_password__form__btn');
        btn.style.opacity = '0';
        await Services.resetPassword(data)
            .then(res => {
                if (res.password) {
                    res.password.forEach(item => {
                        const errorDiv = document.createElement('div');
                        errorDiv.classList.add('error');
                        errorDiv.textContent = item;
                        document.querySelector('.reset_password').insertBefore(errorDiv, event.target);
                    });
                } else {
                    alert('Ваш пароль был успешно сброшен.');
                    window.location.href = '/login';
                }
            })
            .catch(error => {
                alert('Произошла ошибка...');
                console.log(error);
            });
        btn.style.opacity = '1';
    }

    return (
        <>
            <Navbar active="login"/>
            <section className="reset_password__section">
                <div className="container">
                    <div className="reset_password__header">Сброс пароля</div>
                    <div className="reset_password">
                        <form className="reset_password__form" onSubmit={resetPassword}>
                            <div className="register__form__group">
                                <label htmlFor="password">Новый Пароль<span className="required">*</span></label>
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

                            <button
                                style={{width: '25%'}}
                                className="buttons buttons__success reset_password__form__btn"
                                type="submit">
                                Сбросить пароль
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

export default WithServices()(connect(mapStateToProps)(ResetPassword));
