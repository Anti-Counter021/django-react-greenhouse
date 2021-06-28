import React, {Component} from "react";

import New from "../new/new";
import Navbar from "../navbar/navbar";
import Model3D from "../model3d/model3d";
import Products from "../products/products";
import WithServices from "../hoc/with_services";


class Home extends Component {

    render() {
        const {Services} = this.props;

        return (
            <>
                <Navbar active="home"/>
                <Model3D/>
                <New/>
                <section className="products">
                    <div className="container">
                        <div className="header">Наши товары</div>
                        <Products host='' getProducts={Services.getProducts}/>
                    </div>
                </section>
            </>
        );
    }

}

export default WithServices()(Home);
