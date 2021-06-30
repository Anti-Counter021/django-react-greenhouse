import React from "react";

import Navbar from "../navbar/navbar";
import Model3D from "../model3d/model3d";
import WithServices from "../hoc/with_services";

import "./contacts.scss";


/* Контакты */

const Contacts = ({Services}) => {

    const createFeedback = (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        Services.postFeedback(data)
            .then(res => alert('Спасибо за сообщение об ошибке! Мы очень вам благодарны!'))
            .catch(error => console.log(error));
        event.target.reset();
    }

    return (
        <>
            <Navbar active="contacts"/>
            <section className="contacts__section">
                <div className="container">
                    <Model3D/>
                </div>
                <div className="contacts">
                    <h1 className="contacts__header">Форма сообщения об ошибках</h1>
                    <form className="feedback" onSubmit={createFeedback}>
                        <label htmlFor="text">
                            Напишите в чем произошла ошибка<span className="required">*</span>
                        </label>
                        <textarea
                            id="text"
                            required
                            name="text"
                            className="feedback__text"
                            placeholder="Напишите в чем произошла ошибка"
                        />
                        <button style={{width: '40%'}} className="buttons" type="submit">
                            Отправить запрос
                        </button>
                    </form>
                </div>
            </section>
        </>
    );

};

export default WithServices()(Contacts);
