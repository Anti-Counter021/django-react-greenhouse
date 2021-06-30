import React from "react";

import CartNavbar from "../components/cart_navbar/cart_navbar";

/* Состояние */

// Начальное состояние
const initialState = {
    error: false,
    loading: true,
    products: {},
    newProduct: {},
    categories: [],
    productDetail: {},
    navbarLinks: [
        {path: '/', body: 'Главная', id: 'home'},
        {path: '/categories', body: 'Категории', id: 'categories'},
        {path: '/reviews', body: 'Отзывы', id: 'reviews'},
        {path: '#', body: 'Контакты', id: 'contacts'},
        {path: '/cart', body: <><i className="fa fa-cart-arrow-down" aria-hidden="true"/> <CartNavbar/></>, id: 'cart'},
    ],
    sliderItem: 0,
    cart: {},
    userIsAuthenticated: false,
    orders: [],
    date: new Date(),
    reviews: [],
    cartCount: 0,
    filtersReviews: {
        minAppraisal: '1',
        maxAppraisal: '5',
    },
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'PRODUCTS_LOADED':
            return {
                ...state,
                products: action.payload,
                loading: false,
            };
        case 'PRODUCTS_NEXT_LOADED':
            return {
                ...state,
                products: {
                    ...state.products,
                    results: [...state.products.results, ...action.payload.results],
                    next: action.payload.next,
                },
                loading: false,
            };
        case 'PRODUCTS_REQUESTED':
            return {
                ...state,
                loading: true,
            };
        case 'PRODUCTS_ERROR':
            return {
                ...state,
                error: true,
            };
        case 'PRODUCT_NEW_LOADED':
            return {
                ...state,
                newProduct: action.payload,
                loading: false,
            };
        case 'PRODUCT_NEW_REQUESTED':
            return {
                ...state,
                loading: true,
            };
        case 'PRODUCT_NEW_ERROR':
            return {
                ...state,
                error: true,
            };
        case 'CATEGORIES_LOADED':
            return {
                ...state,
                categories: action.payload,
                loading: false,
            };
        case 'CATEGORIES_REQUESTED':
            return {
                ...state,
                loading: true,
            };
        case 'CATEGORIES_ERROR':
            return {
                ...state,
                error: true,
            };
        case 'PRODUCT_DETAIL_LOADED':
            return {
                ...state,
                productDetail: action.payload,
                loading: false,
            };
        case 'PRODUCT_DETAIL_REQUESTED':
            return {
                ...state,
                loading: true,
            };
        case 'PRODUCT_DETAIL_ERROR':
            return {
                ...state,
                error: true,
            };
        case 'ADD_NAVBAR_ELEMENT':
            const navbarLinks = state.navbarLinks;
            return {
                ...state,
                navbarLinks: [...navbarLinks, action.payload],
            };
        case 'DEFAULT_SLIDER_ITEM':
            return {
                ...state,
                sliderItem: action.payload,
            };
        case 'NEXT_SLIDER_ITEM':
            return  {
                ...state,
                sliderItem: action.payload,
            };
        case 'PREV_SLIDER_ITEM':
            return  {
                ...state,
                sliderItem: action.payload,
            };
        case 'CART_LOADED':
            return {
                ...state,
                cart: action.payload,
                loading: false,
            };
        case 'CART_REQUESTED':
            return {
                ...state,
                loading: true,
            };
        case 'CART_ERROR':
            return {
                ...state,
                error: true,
            };
        case 'USER_IS_AUTHENTICATED':
            return {
                ...state,
                userIsAuthenticated: action.payload,
            };
        case 'ORDER_LOADED':
            return {
                ...state,
                orders: action.payload,
                loading: false,
            };
        case 'ORDER_REQUESTED':
            return {
                ...state,
                loading: true,
            };
        case 'ORDER_ERROR':
            return {
                ...state,
                error: true,
            };
        case 'ORDER_DATE':
            return {
                ...state,
                date: action.payload,
            };
        case 'REVIEWS_LOADED':
            return {
                ...state,
                reviews: action.payload,
                loading: false,
            };
        case 'REVIEWS_REQUESTED':
            return {
                ...state,
                loading: true,
            };
        case 'REVIEWS_ERROR':
            return {
                ...state,
                error: true,
            };
        case 'CART_COUNT':
            return {
                ...state,
                cartCount: action.payload,
            };
        case 'FILTER_REVIEWS':
            return {
                ...state,
                filtersReviews: {...state.filtersReviews, ...{[action.name]: action.value}},
            };
        default:
            return state;
    }
};

export default reducer;
