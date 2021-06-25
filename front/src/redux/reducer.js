const initialState = {
    error: false,
    loading: true,
    products: [],
    newProduct: {},
    categories: [],
};

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case 'PRODUCTS_LOADED':
            return {
                ...state,
                products: action.payload,
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
        default:
            return state;
    }
};

export default reducer;
