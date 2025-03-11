import React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import TopSalesFindComp from "./top-sales/TopSalesFindComp.tsx";
import TopSalesListComp from "./top-sales/TopSalesListComp.tsx";
import PagerComp from "./pager/PagerComp.tsx";
import AnalyserComp from "./analyser/AnalyserComp.tsx";

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
                Welcome!
            </Route>
            <Route path="/pager/current-page">
                <PagerComp />
            </Route>
            <Route path="/analyser/results">
                <AnalyserComp />
            </Route>
            <Route path="/">
                <Redirect to='/home' />
            </Route>
        </Switch>
    );
}

export default AppComp;