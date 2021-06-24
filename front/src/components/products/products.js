import React, {Component} from "react";

import {connect} from "react-redux";

import Error from "../error/error";
import Spinner from "../spinner/spinner";
import WithServices from "../hoc/with_services";
import {productsLoaded, productsRequested, productsError} from "../../redux/action";

import "./card.scss"


class Products extends Component {

    componentDidMount() {
        const {productsLoaded, productsRequested, productsError, Services} = this.props;
        productsRequested();
        Services.getProducts().then(products => productsLoaded(products)).catch(error => productsError);
    }

    render() {

        const {products, loading, error} = this.props;

        if (loading) {
            return <Spinner/>
        }

        if (error) {
            return <Error/>
        }

        return (
            <section className="products">
                <div className="container">
                    <div className="header">Наши товары</div>
                    <div className="products__body">
                        {
                            products.map(({title, id, image, price}) => (
                                <div className="card" key={id}>
                                    <div className="card__title">{title}</div>
                                    <img className="card__image" src={image} alt={title}/>
                                    <div className="card__content">
                                        <div className="card__price">Цена: {price} руб.</div>
                                        <ul className="section__product__feature__list">
                                            <li className="section__product__feature">Труба 40x20</li>
                                            <li className="section__product__feature">Расстояние между дугами - 1м</li>
                                            <li className="section__product__feature">Ширина 2м</li>
                                        </ul>
                                    </div>
                                    <div className="products__action">
                                        <button className="buttons buttons__success">Добавить в корзину</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
        );
   }

}

const mapStateToProps = (state) => {
    return {
        products: state.products,
        loading: state.loading,
        error: state.error,
    };
};

const mapDispatchToProps = {
    productsLoaded,
    productsRequested,
    productsError,
};

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(Products));
