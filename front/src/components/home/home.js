import React from "react";

import New from "../new/new";
import Navbar from "../navbar/navbar";
import Slider from "../slider/slider";
import Products from "../products/products";

const Home = () => {

    return (
        <>
            <Navbar/>
            <Slider/>
            <New/>
            <Products/>
        </>
    );

};

export default Home;
