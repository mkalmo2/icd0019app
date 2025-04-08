import React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import TopSalesFindComp from "./top-sales/TopSalesFindComp.tsx";
import TopSalesListComp from "./top-sales/TopSalesListComp.tsx";
import PagerComp from "./pager/PagerComp.tsx";
import AnalyserComp from "./analyser/AnalyserComp.tsx";
import ProductsListComp from "./cart/ProductsListComp.tsx";
import ServicesListComp from "./cart/ServicesListComp.tsx";
import ShoppingCartComp from "./cart/ShoppingCartComp.tsx";
import FpAnalyserListComp from "./fp-analyser/FpAnalyserListComp.tsx";
import FpAnalyserInfoComp from "./fp-analyser/FpAnalyserInfoComp.tsx";
import CustomersListComp from "./customers/CustomersListComp.tsx";

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
            <Route path="/cart/products/list">
                <ProductsListComp />
            </Route>
            <Route path="/cart/products/cart">
                <ShoppingCartComp daoType="product" itemName="Product" />
            </Route>
            <Route path="/cart/products">
                <Redirect to="/cart/products/list" />
            </Route>
            <Route path="/cart/services/list">
                <ServicesListComp />
            </Route>
            <Route path="/cart/services/cart">
                <ShoppingCartComp daoType="service" itemName="Service" />
            </Route>
            <Route path="/cart/services">
                <Redirect to="/cart/services/list" />
            </Route>
            <Route path="/cart">
                <Redirect to='/cart/products/list' />
            </Route>
            <Route path="/fp-analyser/list">
                <FpAnalyserListComp />
            </Route>
            <Route path="/fp-analyser/info">
                <FpAnalyserInfoComp />
            </Route>
            <Route path="/fp-analyser">
                <Redirect to='/fp-analyser/list' />
            </Route>
            <Route path="/customers">
                <CustomersListComp />
            </Route>
            <Route path="/">
                <Redirect to='/home' />
            </Route>
        </Switch>
    );
}

export default AppComp;