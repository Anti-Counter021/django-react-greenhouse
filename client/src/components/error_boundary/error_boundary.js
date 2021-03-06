import React, {Component} from "react";

import Error from "../error/error";


/* Ошибка redux-a */

export default class ErrorBoundary extends Component {

    state = {
        error: false,
    }

    componentDidCatch(error, errorInfo) {
        this.setState({error: true});
    }

    render() {
        if (this.state.error) {
            return <Error/>
        }

        return this.props.children;
    }

}
