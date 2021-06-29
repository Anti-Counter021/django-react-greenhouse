import React, {useEffect} from "react";

import {connect} from "react-redux";
import {Link} from "react-router-dom";

import WithServices from "../hoc/with_services";
import {addNavbarElement, setUserIsAuthenticated} from "../../redux/action";
import GetTokenFromLocalStorage from "../../services/token_from_localstorage";

import "./navbar.scss";


/* Навигация */

const Navbar = ({Services, addNavbarElement, navbarLinks, setUserIsAuthenticated, userIsAuthenticated, active}) => {

    useEffect(() => {
        Services.userIsAuthenticated(GetTokenFromLocalStorage())
            .then(res => {
                setUserIsAuthenticated(res.is_authenticated);
            })
            .catch(error => {
                console.log(error);
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
};


export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(Navbar));
