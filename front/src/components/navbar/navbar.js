import React, {Component} from "react";

import {connect} from "react-redux";
import {Link} from "react-router-dom";

import WithServices from "../hoc/with_services";
import {addNavbarElement} from "../../redux/action";
import GetTokenFromLocalStorage, {DeleteTokenFromLocalStorage} from "../../services/get_token_from_localstorage";

import "./navbar.scss";

class Navbar extends Component {

    componentDidMount() {
        const {Services, addNavbarElement, navbarLinks} = this.props;
        Services.userIsAuthenticated(GetTokenFromLocalStorage())
            .then(res => {
                if (!res.is_authenticated) {
                    if (!navbarLinks.find(item => item.path === '/login')) {
                        addNavbarElement({path: '/login', body: 'Вход / Регистрация', id: 'login'});
                    }
                } else if (res.is_authenticated && !navbarLinks.find(item => item.path === '/logout')) {
                    addNavbarElement({path: '/logout', body: 'Выход', id: 'logout'});
                }
            })
            .catch(error => {
                console.log(error);
                DeleteTokenFromLocalStorage();  // Фикс с изменением токена в localstorage
            });
    }

    render() {
        const {active, navbarLinks} = this.props;

        return (
            <nav className="navbar">
                <div className="nav">
                    {
                        navbarLinks.map(({path, body, id}, index) => (
                            <div key={index} className="nav__item">
                                <Link to={path}
                                      className={"nav__link" + (active === id ? ' active' : '')}>{body}</Link>
                            </div>
                        ))
                    }
                </div>

                <div className="nav__phone">
                    {
                        navbarLinks.map(({path, body, id}, index) => (
                            <div key={index} className="nav__item">
                                <Link to={path}
                                      className={"nav__link" + (active === id ? ' active' : '')}>{body}</Link>
                            </div>
                        ))
                    }
                </div>
            </nav>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        navbarLinks: state.navbarLinks,
    };
};

const mapDispatchToProps = {
    addNavbarElement,
};


export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(Navbar));
