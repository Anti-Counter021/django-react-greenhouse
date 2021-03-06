import React, {useEffect} from "react";

import {connect} from "react-redux";
import {Link} from "react-router-dom";

import WithServices from "../hoc/with_services";
import GetTokenFromLocalStorage from "../../services/token_from_localstorage";
import {addNavbarElement, setUserIsAuthenticated, setCartCount} from "../../redux/action";

import "./navbar.scss";


/* Навигация */

const Navbar = (
    {Services, addNavbarElement, navbarLinks, setUserIsAuthenticated, userIsAuthenticated, active, setCartCount}
) => {

    useEffect(() => {
        Services.userIsAuthenticated(GetTokenFromLocalStorage())
            .then(res => {
                setUserIsAuthenticated(res.is_authenticated);
                setCartCount(res.cart_count);
            })
            .catch(error => {
                console.log(error);
                alert('Произошла ошибка...');
            });
        if (!userIsAuthenticated) {
            if (!navbarLinks.find(item => item.path === '/login') && !GetTokenFromLocalStorage()) {
                addNavbarElement({path: '/login', body: 'Вход / Регистрация', id: 'login'});
            }
        } else if (!navbarLinks.find(item => item.path === '/logout')) {
            addNavbarElement({path: '/profile', body: 'Профиль', id: 'profile'});
            addNavbarElement({path: '/logout', body: 'Выход', id: 'logout'});
        }
    });

    const showNavbar = (event) => {
        document.querySelector('.nav__phone').style.display = 'block';
        event.target.classList.add('hide__nav__phone__btn');
        document.querySelector('.close').classList.remove('hide__nav__phone__btn');
    }

    const hideNavbar = (event) => {
        document.querySelector('.nav__phone').style.display = 'none';
        event.target.classList.add('hide__nav__phone__btn');
        document.querySelector('.open').classList.remove('hide__nav__phone__btn');
    }

    return (
        <nav className="navbar">
            <div className="nav">
                {
                    navbarLinks.map(({path, body, id}, index) => (
                        <div key={index} className="nav__item">
                            <Link to={path} className={"nav__link" + (active === id ? ' active' : '')}>
                                {body}
                            </Link>
                        </div>
                    ))
                }
            </div>

            <div className="nav__phone__hide">
                <i onClick={showNavbar} className="open nav__icons fas fa-bars"/>
                <i onClick={hideNavbar} className="close nav__icons fas fa-times-circle hide__nav__phone__btn"/>
            </div>

            <div className="nav__phone">
                {
                    navbarLinks.map(({path, body, id}, index) => (
                        <div key={index} className="nav__item">
                            <Link to={path} className={"nav__link" + (active === id ? ' active' : '')}>
                                {body}
                            </Link>
                        </div>
                    ))
                }
            </div>
        </nav>
    );

};

const mapStateToProps = (state) => {
    return {
        userIsAuthenticated: state.userIsAuthenticated,
        navbarLinks: state.navbarLinks,
    };
};

const mapDispatchToProps = {
    addNavbarElement,
    setUserIsAuthenticated,
    setCartCount,
};


export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(Navbar));
