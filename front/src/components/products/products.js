import React, {Component} from "react";

import {connect} from "react-redux";

import Error from "../error/error";
import host from "../../services/host";
import Spinner from "../spinner/spinner";
import {productsLoaded, productsRequested, productsError} from "../../redux/action";

import "./card.scss"


class Products extends Component {

    componentDidMount() {
        const {productsLoaded, productsRequested, productsError, getProducts} = this.props;
        productsRequested();
        getProducts().then(products => productsLoaded(products)).catch(error => productsError);
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
            <>
                <div className="products__body">
                    {
                        products.map(({title, id, image, price}) => (
                            <div className="card" key={id}>
                                <div className="card__title">{title}</div>
                                <img className="card__image" src={host + image} alt={title}/>
                                <div className="card__content">
                                    <div className="card__price">Цена: {price} руб.</div>
                                </div>
                                <div className="products__action">
                                    <button className="buttons buttons__success">Добавить в корзину</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Products);
