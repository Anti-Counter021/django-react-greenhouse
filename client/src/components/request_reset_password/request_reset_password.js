import React, {useEffect} from "react";

import {connect} from "react-redux";

import Navbar from "../navbar/navbar";
import WithServices from "../hoc/with_services";
import GetTokenFromLocalStorage from "../../services/token_from_localstorage";

import "./request_reset_password.scss";


const RequestResetPassword = ({Services, userIsAuthenticated}) => {

    useEffect(() => {
        if (userIsAuthenticated && GetTokenFromLocalStorage()) {
            window.location.href = '/';
        }
    });

    const requestDataForResetPassword = (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        document.querySelector('.reset_password__request__form__btn').style.opacity = '0';
        Services.requestResetPassword(data).then(res => {
            if (res.status === 'OK') {
                alert('Письмо для сброса пароля отправлено. Можете проверить свою почту.');
            } else {
                alert('Такой почты не существует!');
            }
            document.querySelector('.reset_password__request__form__btn').style.opacity = '1';
        }).catch(error => {
            console.log(error);
            alert('Произошла ошибка...');
        });
        event.target.reset();
    }

    return (
        <>
            <Navbar active="login"/>
            <section className="reset_password__request__section">
                <div className="container">
                    <div className="reset_password__request__header">Запрос для сброса пароля</div>
                    <div className="reset_password__request">
                        <form className="reset_password__request__form" onSubmit={requestDataForResetPassword}>
                            <div className="reset_password__request__form__group">
                                <label htmlFor="email">Адрес эл. почты<span className="required">*</span></label>
                                <input
                                    required
                                    name="email"
                                    className="reset_password__request__form__input"
                                    id="email"
                                    type="email"
                                    placeholder="Адресс эл. почты"
                                />
                            </div>

                            <button
                                style={{width: '25%'}}
                                className="buttons buttons__success reset_password__request__form__btn"
                                type="submit">
                                Отправить запрос на сброс пароля
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

export default WithServices()(connect(mapStateToProps)(RequestResetPassword));
