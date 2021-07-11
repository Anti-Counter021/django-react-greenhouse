import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from "react-redux";
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router} from "react-router-dom";

import App from './App';
import store from "./store";
import Services from "./services/services";
import ErrorBoundary from "./components/error_boundary/error_boundary";
import ServicesContext from "./components/services_context/services_context";

import './index.scss';

const Service = new Services();

ReactDOM.render(
    <Provider store={store}>
        <ErrorBoundary>
            <ServicesContext.Provider value={Service}>
                <Router>
                    <App/>
                </Router>
            </ServicesContext.Provider>
        </ErrorBoundary>
    </Provider>,
    document.getElementById('root')
);
reportWebVitals();
