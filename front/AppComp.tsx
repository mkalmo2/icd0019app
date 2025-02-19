import React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import TopSalesFindComp from "./top-sales/TopSalesFindComp.tsx";
import TopSalesListComp from "./top-sales/TopSalesListComp.tsx";

const AppComp = () => {

    return (
        <Switch>
            <Route path="/top-sales/list">
                <TopSalesListComp />
            </Route>
            <Route path="/top-sales/find">
                <TopSalesFindComp />
            </Route>
            <Route path="/home">
                icd0019 Sample application
            </Route>
            <Route path="/">
                <Redirect to='/top-sales/list' />
            </Route>
        </Switch>
    );
}

export default AppComp;