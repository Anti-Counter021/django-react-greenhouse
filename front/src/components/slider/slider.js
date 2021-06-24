import React from "react";

const Slider = () => {

    return (
        <section className="section__slider">
            <div className="container">
                <div className="section">
                    <div className="slider">
                        <div className="slider__nav">
                            <i className="arrow arrow__left"/>
                            <img src="https://via.placeholder.com/400x400" alt="" className="slider__image"/>
                            <i className="arrow arrow__right"/>
                        </div>
                    </div>
                    <div className="section__body">
                        <div className="section__content__header">
                            Теплица Капелька
                        </div>
                        <div className="section__content">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores illum mollitia nihil.
                            Ab accusamus commodi distinctio, dolores eum fuga illum impedit in ipsa, laudantium natus
                            placeat quae repellat repudiandae vitae.
                        </div>
                        <div className="section__action">
                            <button className="buttons buttons__success">Добавить в корзину</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

};

export default Slider;
