import React, {Component} from "react";

import Navbar from "../navbar/navbar";
import Products from "../products/products";
import WithServices from "../hoc/with_services";


class GreenHouse extends Component {

    render() {
        const {Services} = this.props;

        return (
            <>
                <Navbar active="Теплицы"/>
                <Products title="Теплицы" getProducts={Services.getGreenhouses}/>
            </>
        );
    }

}

export default WithServices()(GreenHouse);
