/* Действия */

const productsLoaded = (newProducts) => {
    return {
        type: 'PRODUCTS_LOADED',
        payload: newProducts,
    };
};

const productsRequested = () => {
    return {
        type: 'PRODUCTS_REQUESTED',
    };
};

const productsError = () => {
    return {
        type: 'PRODUCTS_ERROR',
    };
};

const productNewLoaded = (newProduct) => {
    return {
        type: 'PRODUCT_NEW_LOADED',
        payload: newProduct,
    };
};

const productNewRequested = () => {
    return {
        type: 'PRODUCT_NEW_REQUESTED',
    };
};

const productNewError = () => {
    return {
        type: 'PRODUCT_NEW_ERROR',
    };
};

const categoriesLoaded = (newCategories) => {
    return {
        type: 'CATEGORIES_LOADED',
        payload: newCategories,
    };
};

const categoriesRequested = () => {
    return {
        type: 'CATEGORIES_REQUESTED',
    };
};

const categoriesError = () => {
    return {
        type: 'CATEGORIES_ERROR',
    };
};

const productDetailLoaded = (productDetail) => {
    return {
        type: 'PRODUCT_DETAIL_LOADED',
        payload: productDetail,
    };
};

const productDetailRequested = () => {
    return {
        type: 'PRODUCT_DETAIL_REQUESTED',
    };
};

const productDetailError = () => {
    return {
        type: 'PRODUCT_DETAIL_ERROR',
    };
};

const addNavbarElement = (element) => {
    return {
        type: 'ADD_NAVBAR_ELEMENT',
        payload: element,
    };
};

const setStartSliderItem = (start) => {
    return {
        type: 'DEFAULT_SLIDER_ITEM',
        payload: start,
    };
};

const setNextSliderItem = (nextSlide) => {
    return {
        type: 'NEXT_SLIDER_ITEM',
        payload: nextSlide,
    };
};

const setPrevSliderItem = (prevSlide) => {
    return {
        type: 'PREV_SLIDER_ITEM',
        payload: prevSlide,
    };
};

const cartLoaded = (newCart) => {
    return {
        type: 'CART_LOADED',
        payload: newCart,
    };
};

const cartRequested = () => {
    return {
        type: 'CART_REQUESTED',
    };
};

const cartError = () => {
    return {
        type: 'CART_ERROR',
    };
};

const setUserIsAuthenticated = (isAuthenticated) => {
    return {
        type: 'USER_IS_AUTHENTICATED',
        payload: isAuthenticated,
    };
};

const ordersLoaded = (newOrders) => {
    return {
        type: 'ORDER_LOADED',
        payload: newOrders,
    };
};

const ordersRequested = () => {
    return {
        type: 'ORDER_REQUESTED',
    };
};

const ordersError = () => {
    return {
        type: 'ORDER_ERROR',
    };
};

const orderDate = (date) => {
    return {
        type: 'ORDER_DATE',
        payload: date,
    };
};

export {
    productsLoaded,
    productsError,
    productsRequested,

    productNewLoaded,
    productNewError,
    productNewRequested,

    categoriesLoaded,
    categoriesError,
    categoriesRequested,

    productDetailLoaded,
    productDetailError,
    productDetailRequested,

    addNavbarElement,

    setStartSliderItem,
    setNextSliderItem,
    setPrevSliderItem,

    cartLoaded,
    cartError,
    cartRequested,

    setUserIsAuthenticated,

    ordersRequested,
    ordersLoaded,
    ordersError,

    orderDate,
};
