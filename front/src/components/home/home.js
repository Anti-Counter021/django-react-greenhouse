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
                <Navbar active="Главная"/>
                <Model3D/>
                <New/>
                <Products host='' title="Наши товары" getProducts={Services.getProducts}/>
            </>
        );
    }

}

export default WithServices()(Home);
