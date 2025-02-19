import React from 'react'
import ReactDOM from 'react-dom'

import AppComp from './AppComp.tsx';
import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("main")).render(
    <React.StrictMode>
        <HashRouter basename='/'>
            <AppComp />
        </HashRouter>
    </React.StrictMode>);
