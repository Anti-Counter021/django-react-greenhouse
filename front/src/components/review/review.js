import React, {Component} from "react";

import Moment from "react-moment";
import {connect} from "react-redux";

import Error from "../error/error";
import Navbar from "../navbar/navbar";
import Spinner from "../spinner/spinner";
import WithServices from "../hoc/with_services";
import GetTokenFromLocalStorage from "../../services/token_from_localstorage";
import {reviewsRequested, reviewsLoaded, reviewsError} from "../../redux/action";

import "./review.scss";


/* Отзывы */

class Review extends Component {

    loadingReviews = () => {
        const {Services, reviewsRequested, reviewsLoaded, reviewsError} = this.props;
        reviewsRequested();
        Services.getReviews()
            .then(res => reviewsLoaded(res))
            .catch(error => reviewsError());
    }

    componentDidMount() {
        this.loadingReviews();
    }

    ratingItem = (e) => {
        e.target.parentNode.parentNode.setAttribute(
            'data-total-value', e.target.parentNode.getAttribute('data-item-value')
        );
    }

    postReview = (e) => {
        const {Services} = this.props;
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        const star = document.querySelector('#form__rating').getAttribute('data-total-value');
        data['appraisal'] = star > 0 ? star : 1;
        Services.postReview(data, GetTokenFromLocalStorage())
            .then(res => {
                alert(res.detail);
                this.loadingReviews();
            })
            .catch(error => alert('Просим прощения, произошла ошибка'));
    }

    render() {

        const {reviews, error, loading, userIsAuthenticated} = this.props;

        if (loading) {
            return (
                <>
                    <Navbar active="reviews"/>
                    <Spinner/>
                </>
            );
        }

        if (error) {
            return <Error/>;
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
                                        placeholder="Комментарий к отзыву"/>
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
                        {
                            reviews.map(({appraisal, id, user, comment, created_at}) => (
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
                        }
                    </div>
                </section>
            </>
        );

    }

}

const mapStateToProps = (state) => {
    return {
        reviews: state.reviews,
        loading: state.loading,
        error: state.error,
        userIsAuthenticated: state.userIsAuthenticated,
    };
};

const mapDispatchToProps = {
    reviewsRequested,
    reviewsLoaded,
    reviewsError,
};

export default WithServices()(connect(mapStateToProps, mapDispatchToProps)(Review));
