import React, {Component} from "react";

import {connect} from "react-redux";

import Navbar from "../navbar/navbar";
import host from "../../services/host";
import Products from "../products/products";
import WithServices from "../hoc/with_services";

import "./categories.scss";


class Categories extends Component {

    // componentDidMount() {
    //     const {Services} = this.props;
    //
    //     // Services.getCategoryProducts().then(res => console.log(res));
    // }

    render() {
        const {Services} = this.props;

        return (
            <>
                <Navbar active='Категории'/>
                <section className="products">
                    <div className="container">
                        <div className="header">Категории</div>
                        <ul className="categories__phone">
                            <li className="categories__phone__item">
                                Автополивы <span className="categories__item__count">2</span>
                            </li>
                            <li className="categories__phone__item">
                                Грядки <span className="categories__item__count">3</span>
                            </li>
                            <li className="categories__phone__item">
                                Заборы <span className="categories__item__count">5</span>
                            </li>
                        </ul>
                        <div className="products__categories">
                            <div className="categories">
                                <div className="categories__item">
                                    Автополивы <span className="categories__item__count">2</span>
                                </div>
                                <div className="categories__item">
                                    Грядки <span className="categories__item__count">3</span>
                                </div>
                                <div className="categories__item">
                                    Заборы <span className="categories__item__count">5</span>
                                </div>
                            </div>
                            <Products title="Теплицы" host={host} getProducts={Services.getGreenhouses}/>
                        </div>
                    </div>
                </section>
            </>
        );
    }

}

export default WithServices()(connect()(Categories));
