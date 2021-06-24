import React from "react";

import "./new.scss"

const New = () => {

    return (
        <section className="new">
            <div className="container">
                <div className="section__header">Новинка 2022</div>
                <div className="section">
                    <img className="section__image" src="https://via.placeholder.com/400x400" alt=""/>
                    <div className="section__body">
                        <div className="section__content__header">Теплица "Прямостенная"</div>
                        <div className="section__content">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores illum mollitia
                            nihil. Ab accusamus commodi distinctio, dolores eum fuga illum impedit in ipsa,
                            laudantium natus placeat quae repellat repudiandae vitae.
                            <ul className="section__product__feature__list">
                                <li className="section__product__feature">Труба 40x20</li>
                                <li className="section__product__feature">Расстояние между дугами - 1м</li>
                                <li className="section__product__feature">Ширина 2м</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

};

export default New;
