import React from 'react';

import "./spinner.scss";

import {ReactComponent as SpinnerIcon} from "../../images/spinner.svg";

/* Спиннер */

const Spinner = () => {

    return (
        <div className="Loader">
            <SpinnerIcon className={"LoaderIcon"}/>
        </div>
    );

}

export default Spinner;
