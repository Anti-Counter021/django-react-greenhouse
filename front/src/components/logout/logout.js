import React, {Component} from "react";

import Navbar from "../navbar/navbar";
import WithServices from "../hoc/with_services";
import GetTokenFromLocalStorage, {DeleteTokenFromLocalStorage} from "../../services/get_token_from_localstorage";

import "./logout.scss";


/* Выход */

class Logout extends Component {

    componentDidMount() {
        const {Services} = this.props;
        Services.userIsAuthenticated(GetTokenFromLocalStorage())
            .then(res => !res.is_authenticated ? window.location.href = '/' : '')
            .catch(error => console.log(error));
    }

    logout = () => {
        /* Выход */

        const {Services} = this.props;
        Services.logoutUser(GetTokenFromLocalStorage())
            .then(() => {
                DeleteTokenFromLocalStorage();
                window.location.href = '/';
            })
            .catch(error => console.log(error));
    }

    render() {

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
                                onClick={this.logout}>
                                    Выйти
                            </button>
                        </div>
                    </div>
                </section>
            </>
        );

    }

}


export default WithServices()(Logout);
