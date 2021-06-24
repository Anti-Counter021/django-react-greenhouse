import React from "react";

import "./navbar.scss";

const Navbar = () => {

    return (
        <nav className="navbar">
            <div className="nav">
                <div className="nav__item"><a href="#" className="nav__link active">Главная</a></div>
                <div className="nav__item"><a href="#" className="nav__link">Категории</a></div>
                <div className="nav__item"><a href="#" className="nav__link">Отзывы</a></div>
                <div className="nav__item"><a href="#" className="nav__link">Контакты</a></div>
                <div className="nav__item cart__icon"><a href="#" className="nav__link">
                    <i className="fa fa-cart-arrow-down" aria-hidden="true"/></a></div>
            </div>
            <div className="nav__toggle">
                <span className="nav__toggle__item"><i className="fas fa-bars"/></span>
            </div>

            <div className="nav__toggle__active">
                <span className="nav__toggle__item"><i className="fa fa-times-circle" aria-hidden="true"/></span>
            </div>
        </nav>
    );

};


export default Navbar;
