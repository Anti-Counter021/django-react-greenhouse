import React from "react";

import CartNavbar from "../components/cart_navbar/cart_navbar";

/* Состояние */

// Начальное состояние
const initialState = {
    errorProducts: false,
    productsLoading: true,
    products: {},
    newProduct: {},
    errorNewProduct: false,
    loadingNewProduct: true,
    categories: [],
    loadingCategories: true,
    errorCategories: false,
    productDetail: {},
    loadingProductDetail: true,
    errorProductDetail: false,
    navbarLinks: [
        {path: '/', body: 'Главная', id: 'home'},
        {path: '/categories', body: 'Категории', id: 'categories'},
        {path: '/reviews', body: 'Отзывы', id: 'reviews'},
        {path: '/contacts', body: 'Контакты', id: 'contacts'},
        {path: '/cart', body: <><i className="fa fa-cart-arrow-down" aria-hidden="true"/> <CartNavbar/></>, id: 'cart'},
    ],
    sliderItem: 0,
    cart: {},
    loadingCart: true,
    errorCart: false,
    userIsAuthenticated: false,
    orders: [],
    date: new Date(),
    reviews: [],
    loadingReviews: true,
    errorReviews: false,
    cartCount: 0,
    filtersReviews: {
        minAppraisal: '1',
        maxAppraisal: '5',
    },
    userData: {},
    loadingUser: true,
    errorUser: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'PRODUCTS_LOADED':
            return {
                ...state,
                products: action.payload,
                productsLoading: false,
            };
        case 'PRODUCTS_NEXT_LOADED':
            return {
                ...state,
                products: {
                    ...state.products,
                    results: [...state.products.results, ...action.payload.results],
                    next: action.payload.next,
                },
                productsLoading: false,
            };
        case 'PRODUCTS_REQUESTED':
            return {
                ...state,
                productsLoading: true,
            };
        case 'PRODUCTS_ERROR':
            return {
                ...state,
                errorProducts: true,
            };
        case 'PRODUCT_NEW_LOADED':
            return {
                ...state,
                newProduct: action.payload,
                loadingNewProduct: false,
            };
        case 'PRODUCT_NEW_REQUESTED':
            return {
                ...state,
                loadingNewProduct: true,
            };
        case 'PRODUCT_NEW_ERROR':
            return {
                ...state,
                errorNewProduct: true,
            };
        case 'CATEGORIES_LOADED':
            return {
                ...state,
                categories: action.payload,
                loadingCategories: false,
            };
        case 'CATEGORIES_REQUESTED':
            return {
                ...state,
                loadingCategories: true,
            };
        case 'CATEGORIES_ERROR':
            return {
                ...state,
                errorCategories: true,
            };
        case 'PRODUCT_DETAIL_LOADED':
            return {
                ...state,
                productDetail: action.payload,
                loadingProductDetail: false,
            };
        case 'PRODUCT_DETAIL_REQUESTED':
            return {
                ...state,
                loadingProductDetail: true,
            };
        case 'PRODUCT_DETAIL_ERROR':
            return {
                ...state,
                errorProductDetail: true,
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
                loadingCart: false,
            };
        case 'CART_REQUESTED':
            return {
                ...state,
                loadingCart: true,
            };
        case 'CART_ERROR':
            return {
                ...state,
                errorCart: true,
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
                loadingCart: false,
            };
        case 'ORDER_REQUESTED':
            return {
                ...state,
                loadingCart: true,
            };
        case 'ORDER_ERROR':
            return {
                ...state,
                errorCart: true,
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
                loadingReviews: false,
            };
        case 'REVIEWS_REQUESTED':
            return {
                ...state,
                loadingReviews: true,
            };
        case 'REVIEWS_ERROR':
            return {
                ...state,
                errorReviews: true,
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
        case 'USER_DATA_LOADED':
            return {
                ...state,
                userData: action.payload,
                loadingUser: false,
            };
        case 'USER_DATA_REQUESTED':
            return {
                ...state,
                loadingUser: true,
            };
        case 'USER_DATA_ERROR':
            return {
                ...state,
                errorUser: true,
            };
        default:
            return state;
    }
};

export default reducer;
