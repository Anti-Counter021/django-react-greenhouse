import React, {Component} from "react";

import {connect} from "react-redux";

import Error from "../error/error";
import Navbar from "../navbar/navbar";
import host from "../../services/host";
import Spinner from "../spinner/spinner";
import WithServices from "../hoc/with_services";
import {
    productDetailLoaded,
    productDetailError,
    productDetailRequested,
    setStartSliderItem,
    setNextSliderItem,
    setPrevSliderItem
} from "../../redux/action";

import "./product_detail.scss";


class ProductDetail extends Component {

    componentDidMount() {
        const {
            Services,
            slugProduct,
            productDetailLoaded,
            productDetailError,
            productDetailRequested,
            setStartSliderItem
        } = this.props;
        productDetailRequested();
        Services.getProductDetail(slugProduct)
            .then(product => productDetailLoaded(product)).catch(error => productDetailError());
        setStartSliderItem(1);
    }

    setDefaultSlider = (number) => {
        this.props.setStartSliderItem(number);
    }

    activeSlide = (index) => {
        const slides = document.querySelectorAll('.slider__image');
        slides.forEach(item => item.classList.add('slider__image__hide'));
        slides[index - 1].classList.remove('slider__image__hide')
    }

    nextSlide = async (count_images) => {
        const {setNextSliderItem, sliderItem} = this.props;
        let slideIndex = sliderItem;
        if (count_images === sliderItem) {
            await this.setDefaultSlider(1);
            slideIndex = 1;
        } else {
            setNextSliderItem(sliderItem + 1);
            slideIndex += 1;
        }
        this.activeSlide(slideIndex);
    }

    prevSlide = async (count_images) => {
        const {setPrevSliderItem, sliderItem} = this.props;
        let slideIndex = sliderItem;
        if (sliderItem === 1) {
            await this.setDefaultSlider(count_images);
            slideIndex = count_images;
        } else {
            setPrevSliderItem(sliderItem - 1);
            slideIndex -= 1;
        }
        this.activeSlide(slideIndex);
    }

    render() {

        const {
            productDetail: {title, image, description, price, additional_images, count_images},
            loading,
            error,
            sliderItem,
        } = this.props;
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
                                {additional_images && additional_images.length ? (
                                    <>
                                        <div className="slider__total__current">{sliderItem} из {count_images}</div>
                                        <i className="arrow arrow__left" onClick={() => this.prevSlide(count_images)}/>
                                        <img onClick={() => this.nextSlide(count_images)} src={host + image} alt={title} className="slider__image"/>
                                        {additional_images && additional_images.length ?
                                            (additional_images.map(({image, id}) => (
                                                <img onClick={() => this.nextSlide(count_images)} key={id} src={host + image} alt={title}
                                                     className="slider__image slider__image__hide"/>
                                            ))) : null
                                        }
                                        <i className="arrow arrow__right" onClick={() => this.nextSlide(count_images)}/>
                                    </>
                                ) : <img src={host + image} alt={title} className="slider__image"/>}
                            </div>
                            <div className="section__body">
                                <div className="section__content">
                                    Описание: <p style={{margin: '10px 0 0 15px'}}>{description}</p>

                                    <p className="product__price">Цена: <span
                                        className="product__price__rub">{price}</span> руб.</p>
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
        sliderItem: state.sliderItem,
    };
};

const mapDispatchToProps = {
    productDetailLoaded,
    productDetailError,
    productDetailRequested,
    setStartSliderItem,
    setNextSliderItem,
    setPrevSliderItem,
};

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(ProductDetail));
