import React from "react";

import New from "../new/new";
import Navbar from "../navbar/navbar";
import Model3D from "../model3d/model3d";
import Products from "../products/products";
import WithServices from "../hoc/with_services";


/* Главная страница */

const Home = ({Services}) => {

    return (
        <>
            <Navbar active="home"/>
            <Model3D/>
            <New/>
            <section className="products">
                <div className="container">
                    <div className="header">Наши товары</div>
                    <Products showButton getProducts={Services.getProducts}/>
                </div>
            </section>
        </>
    );

};

export default WithServices()(Home);
