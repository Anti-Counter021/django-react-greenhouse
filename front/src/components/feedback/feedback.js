import React from "react";

import WithServices from "../hoc/with_services";

import "./feedback.scss";


/* Обратная связь */

const Feedback = ({Services}) => {

    const createFeedback = (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        Services.postFeedback(data)
            .then(res => alert('Спасибо за сообщение об ошибке! Мы очень вам благодарны!'))
            .catch(error => console.log(error));
        event.target.reset();
    }

    return (
        <div className="feedback__section">
            <h1 className="feedback__section__header">Форма сообщения об ошибках</h1>
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
    );

};

export default WithServices()(Feedback);
