import React, {Component} from "react";

import {connect} from "react-redux";
import {Link} from "react-router-dom";

import Error from "../error/error";
import Spinner from "../spinner/spinner";
import WithServices from "../hoc/with_services";
import GetTokenFromLocalStorage from "../../services/token_from_localstorage";
import {productsLoaded, productsRequested, productsError, setCartCount, nexPageWithProductsLoaded} from "../../redux/action";

import "./card.scss";


/* Карточки товаров */

class Products extends Component {

    loadProducts = (page=1) => {
        const {productsLoaded, productsRequested, productsError, getProducts, nexPageWithProductsLoaded} = this.props;
        if (page === 1) {
            productsRequested();
            getProducts(page).then(products => productsLoaded(products)).catch(error => productsError);
        } else {
            getProducts(page).then(products => nexPageWithProductsLoaded(products)).catch(error => productsError);
        }
    }

    componentDidMount() {
        this.loadProducts();
    }

    addToCart = (productId) => {
        /* Добавление товара в корзину */

        const {Services, userIsAuthenticated, setCartCount, cartCount} = this.props;
        Services.addNewProductInCart(productId, GetTokenFromLocalStorage())
            .then(res => {
                alert('Товар добавлен в корзину!');
                setCartCount(cartCount + 1);
            })
            .catch(error => {
                if (!userIsAuthenticated) {
                    alert('Необходимо авторизироваться!');
                } else {
                    alert('Товар уже в корзине!');
                }
            });
    }

    nextPage = (nextPage) => {
        this.loadProducts(nextPage.split('=').pop());
    }

    render() {

        const {products: {results, next}, loading, error, showButton} = this.props;

        if (loading) {
            return <Spinner/>
        }

        if (error) {
            return <Error/>
        }

        const nextBtn = (
            <div className="products__btn">
                <button onClick={() => this.nextPage(next)} className="buttons buttons__success">
                    Загрузить ещё
                </button>
            </div>
        );

        return (
            <>
                <div className="products__body">
                    {
                        results && results.length ? (
                            results.map(({title, id, image, price, slug, discount, price_with_discount}) => (
                                <div className="card" key={id}>
                                    <div className="card__title">{title}</div>
                                    <Link to={`/products/${slug}`}>
                                        <img className="card__image" src={image} alt={title}/>
                                    </Link>
                                    <div className="card__content">
                                        {
                                            !discount ? (
                                                <div className="card__price">Цена: {price} руб.</div>
                                            ) : (
                                                <>
                                                    <div className="card__price">
                                                        Цена: <del>{price} руб.</del>
                                                        <sup className="discount">
                                                            -{discount}%
                                                        </sup>
                                                    </div>
                                                    <div className="card__price">Цена: {price_with_discount} руб.</div>
                                                </>
                                            )
                                        }
                                    </div>
                                    <div className="products__action">
                                        <button className="buttons buttons__success" onClick={() => this.addToCart(id)}>
                                            Добавить в корзину
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : null
                    }
                </div>
                {
                    next && showButton ? (
                        nextBtn
                    ) : null
                }
            </>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        products: state.products,
        loading: state.loading,
        error: state.error,
        cartCount: state.cartCount,
        userIsAuthenticated: state.userIsAuthenticated,
    };
};

const mapDispatchToProps = {
    productsLoaded,
    productsRequested,
    productsError,
    setCartCount,
    nexPageWithProductsLoaded,
};

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(Products));
