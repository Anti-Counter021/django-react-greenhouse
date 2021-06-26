import React, {Component} from "react";

import {connect} from "react-redux";

import Error from "../error/error";
import Navbar from "../navbar/navbar";
import host from "../../services/host";
import Spinner from "../spinner/spinner";
import WithServices from "../hoc/with_services";
import {productDetailLoaded, productDetailError, productDetailRequested} from "../../redux/action";

import "./product_detail.scss";


class ProductDetail extends Component {

    componentDidMount() {
        const {Services, slugProduct, productDetailLoaded, productDetailError, productDetailRequested} = this.props;
        productDetailRequested();
        Services.getProductDetail(slugProduct)
            .then(product => productDetailLoaded(product)).catch(error => productDetailError());
    }

    render() {

        const {productDetail: {title, image, description, price}, loading, error} = this.props;
        let {features} = this.props.productDetail;

        if (!features) {
            features = [];
        }

        if (error) {
            return <Error/>
        }

        if (loading) {
            return <Spinner/>
        }

        return (
            <>
                <Navbar/>
                <section className="product__section">
                    <div className="container">
                        <div className="header">{title}</div>
                        <div className="section">
                            <div className="slider__nav">
                                <i className="arrow arrow__left"/>
                                <img src={host + image} alt={title} className="slider__image"/>
                                <i className="arrow arrow__right"/>
                            </div>
                            <div className="section__body">
                                <div className="section__content">
                                    Описание: <p style={{margin: '10px 0 0 15px'}}>{description}</p>

                                    <p className="product__price">Цена: <span className="product__price__rub">{price}</span> руб.</p>
                                </div>
                                <div className="product__action">
                                    <button className="buttons buttons__success">Добавить в корзину</button>
                                </div>
                                {
                                    features.length ? (
                                        <table className="table">
                                            <thead>
                                                <tr className="product__table__header">
                                                    <th>Название</th>
                                                    <th>Характеристика</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    features.map(({id, name, feature_value, unit}) => (
                                                        <tr key={id} className="product__table__content">
                                                            <td>{name}</td>
                                                            <td>{feature_value} {unit}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    ) : null
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );

    }

}


const mapStateToProps = (state) => {
    return {
        productDetail: state.productDetail,
        loading: state.loading,
        error: state.error,
    };
};

const mapDispatchToProps = {
    productDetailLoaded,
    productDetailError,
    productDetailRequested,
};

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(ProductDetail));
