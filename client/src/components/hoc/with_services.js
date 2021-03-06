import React from "react";

import ServicesContext from "../services_context/services_context";


/* Доступ к бэку только, где нужно */

const WithServices = () => (Wrapped) => {

    return (props) => {
        return (
            <ServicesContext.Consumer>
                {
                    (Services) => {
                        return <Wrapped {...props} Services={Services}/>
                    }
                }
            </ServicesContext.Consumer>
        );
    };

};

export default WithServices
