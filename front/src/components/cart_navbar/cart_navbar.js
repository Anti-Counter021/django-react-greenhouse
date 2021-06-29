import React, {useEffect} from "react";

import {connect} from "react-redux";


const CartNavbar = ({cartCount}) => {

    useEffect(() => {

    });

    return (
        <span>{cartCount}</span>
    );

};

const mapStateToProps = (state) => {
    return {
        cartCount: state.cartCount,
    };
};

export default connect(mapStateToProps)(CartNavbar);
