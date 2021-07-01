import React, {Component} from "react";

import {connect} from "react-redux";
import {Link} from "react-router-dom";

import Error from "../error/error";
import Navbar from "../navbar/navbar";
import Spinner from "../spinner/spinner";
import Products from "../products/products";
import WithServices from "../hoc/with_services";
import {
    categoriesError,
    categoriesRequested,
    categoriesLoaded,
    productsRequested,
    productsLoaded,
} from "../../redux/action";

import "./categories.scss";


/* Категории */

class Categories extends Component {

    componentDidMount() {
        const {Services, categoriesError, categoriesRequested, categoriesLoaded} = this.props;
        categoriesRequested();

        Services.getCategoryProducts().then(res => categoriesLoaded(res)).catch(error => categoriesError());
    }

    getProducts = (id) => {
        /* Товары этой категории */

        const {categories, productsRequested, productsLoaded} = this.props;
        productsRequested();
        productsLoaded({results: categories.find(item => item.id === id).products});
    }

    render() {

        let {categories, Services, loading, error} = this.props;

        if (error) {
            return (
                <>
                    <Navbar active="categories"/>
                    <Error/>
                </>
            );
        }

        if (loading) {
            return (
                <>
                    <Navbar active="categories"/>
                    <Spinner/>
                </>
            );
        }

        return (
            <>
                <Navbar active='categories'/>
                <section className="products">
                    <div className="container">
                        <div className="header">Категории</div>
                        <ul className="categories__phone">
                            {
                                categories.map(({name, id, products_count, slug}) => (
                                    <li
                                        className="categories__phone__item"
                                        key={id}
                                        onClick={() => this.getProducts(id)}>
                                            <Link style={{color: '#fff'}} to={`/categories/${slug}`}>
                                                {name} <span className="categories__item__count">{products_count}</span>
                                            </Link>
                                    </li>
                                ))
                            }
                        </ul>
                        <div className="products__categories">
                            <div className="categories">
                                {
                                    categories.map(({name, id, products_count, slug}) => (
                                        <div className="categories__item" key={id} onClick={() => this.getProducts(id)}>
                                            <Link style={{color: '#fff'}} to={`/categories/${slug}`}>
                                                {name} <span className="categories__item__count">{products_count}</span>
                                            </Link>
                                        </div>
                                    ))
                                }
                            </div>
                            <Products title="Теплицы" getProducts={Services.getProducts}/>
                        </div>
                    </div>
                </section>
            </>
        );

    }

}

const mapStateToProps = (state) => {
    return {
        categories: state.categories,
        loading: state.loadingCategories,
        error: state.errorCategories,
    };
};

const mapDispatchToProps = {
    categoriesLoaded,
    categoriesRequested,
    categoriesError,
    productsRequested,
    productsLoaded,
};

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(Categories));
