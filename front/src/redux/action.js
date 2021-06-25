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
};
