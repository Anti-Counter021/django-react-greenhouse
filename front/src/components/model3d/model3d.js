import React, {Component} from "react";

import * as THREE from "three";
import Model from "./scene.glb";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export default class Model3D extends Component {

    componentDidMount() {
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.y = 3;
        camera.position.z = 19;

        let renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(500, 240)

        if (window.innerWidth < 570) {
            camera.position.z = 42;
        }

        renderer.domElement.setAttribute('id', 'Greenhouse3DObj');
        document.querySelector('.model__nav').append(renderer.domElement);

        const aLight = new THREE.AmbientLight(0x404040, 1.2);
        scene.add(aLight);

        const pLight = new THREE.PointLight(0xFFFFFF, 1.2);
        pLight.position.set(0, -3, 7);
        scene.add(pLight);

        let loader = new GLTFLoader();
        let obj = null;

        loader.load(Model, (gltf) => {
            obj = gltf;
            obj.scene.scale.set(1.3, 1.3, 1.3);

            scene.add(obj.scene);
        });

        function animate() {
            requestAnimationFrame(animate);

            if (obj) {
                obj.scene.rotation.y += 0.005;
            }
            renderer.render(scene, camera)
        }

        animate();
    }

    render() {
        return (
            <section className="section__model">
                <div className="container">
                    <div className="section">
                        <div className="model">
                            <div className="model__nav">
                            </div>
                        </div>
                        <div className="section__body">
                            <div className="section__content__header">
                                О нас
                            </div>
                            <div className="section__content">
                                Мы интернет магазин по прадаже теплиц. У нас много товаров и большой ассортимент.
                                Так же мы предлагаем доп. оборудование для теплиц и сада!
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

}
