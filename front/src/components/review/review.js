import React, {Component} from "react";

import Moment from "react-moment";
import {connect} from "react-redux";

import Error from "../error/error";
import Navbar from "../navbar/navbar";
import Spinner from "../spinner/spinner";
import WithServices from "../hoc/with_services";
import GetTokenFromLocalStorage from "../../services/token_from_localstorage";
import {reviewsRequested, reviewsLoaded, reviewsError, filterReviews} from "../../redux/action";

import "./review.scss";


/* Отзывы */

class Review extends Component {

    loadingReviews = (page=1) => {
        const {Services, reviewsLoaded, reviewsError, filter} = this.props;
        Services.getReviews(page, `appraisal_min=${filter.minAppraisal}&appraisal_max=${filter.maxAppraisal}`)
            .then(res => reviewsLoaded(res))
            .catch(error => reviewsError());
    }

    componentDidMount() {
        this.props.reviewsRequested();
        this.loadingReviews();
    }

    nextOrPrevPage = (numPage) => {
        let page = numPage.split('=').pop();
        if (isNaN(+page) || !(numPage.includes('&page='))) {
            page = 1;
        }
        this.loadingReviews(page);
    }

    ratingItem = (e) => {
        e.target.parentNode.parentNode.setAttribute(
            'data-total-value', e.target.parentNode.getAttribute('data-item-value')
        );
    }

    postReview = (e) => {
        const {Services, reviewsRequested} = this.props;
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        const star = document.querySelector('#form__rating').getAttribute('data-total-value');
        data['appraisal'] = star > 0 ? star : 1;
        Services.postReview(data, GetTokenFromLocalStorage())
            .then(res => {
                alert(res.detail);
                reviewsRequested();
                this.loadingReviews();
            })
            .catch(error => alert('Просим прощения, произошла ошибка'));
    }

    setFilter = async (name, value) => {
        const {filterReviews} = this.props;
        await filterReviews(name, value);
        await this.loadingReviews();
    }

    render() {

        const {reviews: {results, next, previous}, error, loading, userIsAuthenticated} = this.props;

        const paginationBtn = (text, paginationParam) =>
        {
            return (
                <button onClick={() => this.nextOrPrevPage(paginationParam)} className="buttons buttons__success">
                    {text}
                </button>
            );
        };

        if (loading) {
            return (
                <>
                    <Navbar active="reviews"/>
                    <Spinner/>
                </>
            );
        }

        if (error) {
            return (
                <>
                    <Navbar active="reviews"/>
                    <Error/>
                </>
            );
        }

        return (
            <>
                <Navbar active="reviews"/>
                <section className="reviews">
                    <div className="container">
                        <div className="header">Отзывы</div>
                        {
                            userIsAuthenticated ? (
                                <form className="reviews__body" onSubmit={this.postReview}>
                                    <input
                                        name="comment"
                                        className="reviews__form__input"
                                        type="text"
                                        placeholder="Комментарий к отзыву"
                                        maxLength="200"
                                    />
                                    <div id="form__rating" className="rating" data-total-value="0">
                                        <div onClick={this.ratingItem} className="rating__item" data-item-value="5">
                                            <span className="star">★</span>
                                        </div>
                                        <div onClick={this.ratingItem} className="rating__item" data-item-value="4">
                                            <span className="star">★</span>
                                        </div>
                                        <div onClick={this.ratingItem} className="rating__item" data-item-value="3">
                                            <span className="star">★</span>
                                        </div>
                                        <div onClick={this.ratingItem} className="rating__item" data-item-value="2">
                                            <span className="star">★</span>
                                        </div>
                                        <div onClick={this.ratingItem} className="rating__item" data-item-value="1">
                                            <span className="star">★</span>
                                        </div>
                                    </div>
                                    <button className="buttons buttons__success" type="submit">Оставить отзыв</button>
                                </form>
                            ) : null
                        }
                        <div className="filters">
                            <h1 className="filters__header">Фильтрация отзывов</h1>
                            <form className="filters__form">
                                <input
                                    onChange={(event => this.setFilter(event.target.name, event.target.value))}
                                    name="minAppraisal"
                                    type="number"
                                    className="reviews__filter__input"
                                    placeholder="От"
                                    min="1"
                                    max="4"
                                />
                                <input
                                    onChange={(event => this.setFilter(event.target.name, event.target.value))}
                                    name="maxAppraisal"
                                    type="number"
                                    className="reviews__filter__input"
                                    placeholder="До"
                                    min="2"
                                    max="5"
                                />
                            </form>
                        </div>
                        {
                            results && results.length ? (
                                results.map(({appraisal, id, user, comment, created_at}) => (
                                    <div key={id} className="reviews__body">
                                        <div className="reviews__author">
                                            <i className="user__icon fa fa-user" aria-hidden="true"/>
                                            <span className="reviews__author__username"> {user}</span>
                                        </div>
                                        <div className="reviews__content">
                                            <div className="reviews__text">
                                                {comment ? `${comment},` : null} Дата публикации {<Moment format="DD.MM.YYYY" date={created_at}/>}
                                            </div>
                                            <div className="rating" data-total-value={appraisal}>
                                                <div className="rating__item" data-item-value="5">
                                                    <span className="star">★</span>
                                                </div>
                                                <div className="rating__item" data-item-value="4">
                                                    <span className="star">★</span>
                                                </div>
                                                <div className="rating__item" data-item-value="3">
                                                    <span className="star">★</span>
                                                </div>
                                                <div className="rating__item" data-item-value="2">
                                                    <span className="star">★</span>
                                                </div>
                                                <div className="rating__item" data-item-value="1">
                                                    <span className="star">★</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            ))
                            ) : null
                        }
                        <div className="pagination__btn">
                            {
                                previous ? paginationBtn('Показать предыдущие', previous) : null
                            }
                            {
                                next ? paginationBtn('Загрузить ещё', next) : null
                            }
                        </div>
                    </div>
                </section>
            </>
        );

    }

}

const mapStateToProps = (state) => {
    return {
        reviews: state.reviews,
        loading: state.loadingReviews,
        error: state.errorReviews,
        userIsAuthenticated: state.userIsAuthenticated,
        filter: state.filtersReviews,
    };
};

const mapDispatchToProps = {
    reviewsRequested,
    reviewsLoaded,
    reviewsError,
    filterReviews,
};

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(Review));
