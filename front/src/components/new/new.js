import React, {Component} from "react";

import {connect} from "react-redux";

import Error from "../error/error";
import Spinner from "../spinner/spinner";
import WithServices from "../hoc/with_services";
import {productNewLoaded, productNewError, productNewRequested} from "../../redux/action";

import "./new.scss"


class New extends Component {

    componentDidMount() {
        const {productNewLoaded, productNewRequested, productNewError, Services} = this.props;
        productNewRequested();
        Services.getNewProduct().then(product => productNewLoaded(product)).catch(error => productNewError);
    }

    render() {

        const {newProduct: {image, title, id, description, price}, loading, error} = this.props;

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
                        <img className="section__image section__image__new" src={image} alt={title}/>
                        <div className="section__body">
                            <div className="section__new__content__header">"{title}"</div>
                            <div className="section__new__content">
                                {description}
                            </div>
                            <div className="section__new__content">Цена: <span id="section__new__price">{price}</span> руб.</div>
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
