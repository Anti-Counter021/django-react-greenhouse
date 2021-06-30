import React, {Component} from "react";

import {connect} from "react-redux";
import {Link} from "react-router-dom";

import Error from "../error/error";
import host from "../../services/host";
import Spinner from "../spinner/spinner";
import WithServices from "../hoc/with_services";
import {productNewLoaded, productNewError, productNewRequested} from "../../redux/action";

import "./new.scss"


/* Блок с новинкой */

class New extends Component {

    componentDidMount() {
        const {productNewLoaded, productNewRequested, productNewError, Services} = this.props;
        productNewRequested();
        Services.getNewProduct().then(product => productNewLoaded(product)).catch(error => productNewError);
    }

    render() {

        const {
            newProduct: {image, title, id, description, price, slug, discount, price_with_discount},
            loading,
            error,
        } = this.props;

        if (loading) {
            return <Spinner/>
        }

        if (error) {
            return <Error/>
        }

        return (
            <section className="new">
                <div className="container">
                    <div className="section__header">Новинка {new Date().getFullYear()}</div>
                    <div className="section" key={id}>
                        <Link to={`/products/${slug}`}>
                            <img className="section__image section__image__new" src={host + image} alt={title}/>
                        </Link>
                        <div className="section__body">
                            <div className="section__new__content__header">"{title}"</div>
                            <div className="section__new__content">
                                {description}
                            </div>
                            <div className="section__new__content">
                                Цена: <br/> {
                                    !discount ? (
                                        <>
                                            <span className="section__new__price">{price}</span> руб.
                                        </>
                                    ) : (
                                        <>
                                            <div className="old_price_new">
                                                <del>{price} руб.</del>
                                                <sup className="discount">-{discount}%</sup>
                                            </div>

                                            <br/>

                                            <span className="section__new__price">{price_with_discount}</span> руб.
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );

    }

}

const mapStateToProps = (state) => {
    return {
        newProduct: state.newProduct,
        loading: state.loading,
        error: state.error,
    };
};

const mapDispatchToProps = {
    productNewLoaded,
    productNewRequested,
    productNewError,
};

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(New));
