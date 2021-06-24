import React, {Component} from "react";

import New from "../new/new";
import Navbar from "../navbar/navbar";
import Slider from "../slider/slider";
import Products from "../products/products";
import WithServices from "../hoc/with_services";


class Home extends Component {

    render() {
        const {Services} = this.props;

        return (
            <>
                <Navbar active="Главная"/>
                <Slider/>
                <New/>
                <Products title="Наши товары" getProducts={Services.getProducts}/>
            </>
        );
    }

}

export default WithServices()(Home);
