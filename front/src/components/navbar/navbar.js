import React from "react";

import {Link} from "react-router-dom";

import "./navbar.scss";

const navbarLink = [
    {path: '/', body: 'Главная'},
    {path: '/greenhouses', body: 'Теплицы'},
    {path: '#', body: 'Категории'},
    {path: '#', body: 'Отзывы'},
    {path: '#', body: 'Контакты'},
    {path: '#', body: <i className="fa fa-cart-arrow-down" aria-hidden="true"/>},
];

const Navbar = ({active}) => {

    return (
        <nav className="navbar">
            <div className="nav">
                {
                    navbarLink.map(({path, body}, index) => (
                        <div key={index} className="nav__item">
                            <Link to={path} className={"nav__link" + (active === body ? ' active': '')}>{body}</Link>
                        </div>
                    ))
                }
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
