import React, {Component} from "react";

import Navbar from "../navbar/navbar";
import host from "../../services/host";
import Products from "../products/products";
import WithServices from "../hoc/with_services";


class GreenHouse extends Component {

    render() {
        const {Services} = this.props;

        return (
            <>
                <Navbar active="Теплицы"/>
                <section className="products">
                    <div className="container">
                        <div className="header">Теплицы</div>
                        <Products host={host} getProducts={Services.getGreenhouses}/>
                    </div>
                </section>
            </>
        );
    }

}

export default WithServices()(GreenHouse);
