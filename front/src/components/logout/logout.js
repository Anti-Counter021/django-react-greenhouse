import React, {useEffect} from "react";

import {connect} from "react-redux";

import Navbar from "../navbar/navbar";
import WithServices from "../hoc/with_services";
import {setUserIsAuthenticated} from "../../redux/action";
import GetTokenFromLocalStorage, {DeleteTokenFromLocalStorage} from "../../services/token_from_localstorage";

import "./logout.scss";


/* Выход */

const Logout = ({Services, setUserIsAuthenticated, userIsAuthenticated}) => {

    useEffect(() => {
        if (!userIsAuthenticated && !GetTokenFromLocalStorage()) {
            window.location.href = '/';
        }
    });

    const logout = () => {
        /* Выход */

        Services.logoutUser(GetTokenFromLocalStorage())
            .then(() => {
                DeleteTokenFromLocalStorage();
                window.location.href = '/';
                setUserIsAuthenticated(false);
            })
            .catch(error => {
                console.log(error);
                alert('Произошла ошибка...')
            });
    };

    return (
        <>
            <Navbar active="logout"/>
            <section className="logout__section">
                <div className="container">
                    <div className="logout__header">Выход</div>
                    <div className="logout">
                        <button
                            style={{width: '25%'}}
                            className="logout__btn buttons buttons__success"
                            onClick={logout}>
                            Выйти
                        </button>
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

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(Logout));
