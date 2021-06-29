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
    setPrevSliderItem,
    setCartCount,
} from "../../redux/action";
import GetTokenFromLocalStorage from "../../services/token_from_localstorage";

import "./product_detail.scss";


/* Детализация товара */

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
            .then(product => productDetailLoaded(product))
            .catch(error => productDetailError());
        setStartSliderItem(1);
    }

    setDefaultSlider = (number) => {
        /* Установка слайда по умолчанию */

        this.props.setStartSliderItem(number);
    }

    activeSlide = (index) => {
        /* Активный слайд */

        const slides = document.querySelectorAll('.slider__image');
        slides.forEach(item => item.classList.add('slider__image__hide'));
        slides[index - 1].classList.remove('slider__image__hide')
    }

    nextSlide = async (count_images) => {
        /* Следующий слайд */

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
        /* Предыдущий слайд */

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

    addToCart = (productId) => {
        /* Добавление товара в корзину */

        const {Services, userIsAuthenticated, setCartCount, cartCount} = this.props;
        const success = document.querySelector('.success');
        Services.addNewProductInCart(productId, GetTokenFromLocalStorage())
            .then(res => {
                success.textContent = 'Товар добавлен в корзину!';
                success.style.display = 'block';
                setTimeout(() => success.style.display = 'none', 1500);
                setCartCount(cartCount + 1);
            })
            .catch(error => {
                if (!userIsAuthenticated) {
                    success.textContent = 'Необходимо авторизироваться!';
                } else {
                    success.textContent = 'Товар уже в корзине!';
                }
                success.style.display = 'block';
                setTimeout(() => success.style.display = 'none', 1500);
            });
    }

    render() {

        const {
            productDetail: {title, image, description, price, additional_images, count_images, id},
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
            return (
                <>
                    <Navbar/>
                    <Spinner/>
                </>
            );
        }

        return (
            <>
                <Navbar/>
                <section className="product__section">
                    <div className="container">
                        <div className="header">{title}</div>
                        <div className="success" style={{display: 'none'}}>Товар добавлен в корзину!</div>
                        <div className="section">
                            <div className="slider__nav">
                                {additional_images && additional_images.length ? (
                                    <>
                                        <div className="slider__total__current">{sliderItem} из {count_images}</div>
                                        <i className="arrow arrow__left" onClick={() => this.prevSlide(count_images)}/>

                                        <img
                                            onClick={() => this.nextSlide(count_images)}
                                            src={host + image} alt={title}
                                            className="slider__image"
                                        />

                                        {additional_images && additional_images.length ?
                                            (additional_images.map(({image, id}) => (
                                                <img
                                                    onClick={() => this.nextSlide(count_images)}
                                                    key={id}
                                                    src={host + image}
                                                    alt={title}
                                                    className="slider__image slider__image__hide"
                                                />
                                            ))) : null
                                        }

                                        <i className="arrow arrow__right" onClick={() => this.nextSlide(count_images)}/>
                                    </>
                                ) : <img src={host + image} alt={title} className="slider__image"/>}
                            </div>
                            <div className="section__body">
                                <div className="section__content">
                                    Описание: <p style={{margin: '10px 0 0 15px'}}>{description}</p>

                                    <p className="product__price">
                                        Цена: <span className="product__price__rub">{price}</span> руб.
                                    </p>
                                </div>
                                <div className="product__action">
                                    <button className="buttons buttons__success" onClick={() => this.addToCart(id)}>
                                        Добавить в корзину
                                    </button>
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
        cartCount: state.cartCount,
        productDetail: state.productDetail,
        loading: state.loading,
        error: state.error,
        sliderItem: state.sliderItem,
        userIsAuthenticated: state.userIsAuthenticated,
    };
};

const mapDispatchToProps = {
    productDetailLoaded,
    productDetailError,
    productDetailRequested,
    setStartSliderItem,
    setNextSliderItem,
    setPrevSliderItem,
    setCartCount,
};

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(ProductDetail));
