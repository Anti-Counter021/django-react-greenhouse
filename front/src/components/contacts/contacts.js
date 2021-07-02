import React from "react";

import Navbar from "../navbar/navbar";
import Model3D from "../model3d/model3d";
import Feedback from "../feedback/feedback";

import "./contacts.scss";


/* Контакты */

const Contacts = () => {

    return (
        <>
            <Navbar active="contacts"/>
            <section className="contacts__section">
                <div className="container">
                    <Model3D/>
                </div>
                <Feedback/>
            </section>
        </>
    );

};

export default Contacts;
