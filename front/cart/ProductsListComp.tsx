import React, { Component } from 'react';
import ProductCartDao from "./ProductCartDao.ts";
import PaginationComp from "../top-sales/PaginationComp.tsx";

type Product = {
    id: string,
    price: number
}

type Result = {
    pageRows: Product[],
    totalRowCount: number,
}

type State = {
    pageNo: number,
    pageSize: number,
    totalRowCount: number,
    pageRows: Product[],
    coupon: string,
    statusMessage: string
}

const dao = new ProductCartDao();

export default class ProductsListComp extends Component<{}, {}> {

    state: State = {
        pageNo: 0,
        pageSize: 3,
        totalRowCount: 0,
        pageRows: [],
        coupon: '',
        statusMessage: ''
    }

    async componentDidMount() {
        await this.refreshRows();
    }

    async refreshRows() {
        const result = await dao.getItems(this.state.pageNo, this.state.pageSize) as Result;
        this.setState({pageRows: result.pageRows, totalRowCount: result.totalRowCount });
    }

    async updatePage(pageNo: number, pageSize: number) {
        this.setState({pageNo, pageSize}, async () => {
            await this.refreshRows();
        });
    }

    async addToCart(product: Product) {
        try {
            await dao.addItem(product.id);
            this.setState({ statusMessage: `Product "${product.id}" added to cart` });
        } catch (error) {
            this.setState({ statusMessage: `Error: ${error.message}` });
        }
    }

    async applyDiscount() {
        if (!this.state.coupon) {
            this.setState({ statusMessage: 'Please enter a coupon code' });
            return;
        }

        try {
            await dao.applyCoupon(this.state.coupon);
            this.setState({ 
                statusMessage: `Coupon "${this.state.coupon}" applied to products`,
                coupon: ''
            });
        } catch (error) {
            this.setState({ statusMessage: `Error: ${error.message}` });
        }
    }

    render() {
        return (
            <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Products</h4>
                    <div>
                        <a 
                            href="#/cart/products/cart"
                            className="btn btn-primary me-2">
                            View Cart
                        </a>
                    </div>
                </div>
                
                {this.state.statusMessage && (
                    <div className="alert alert-info alert-dismissible fade show" role="alert">
                        {this.state.statusMessage}
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => this.setState({ statusMessage: '' })}
                            aria-label="Close">
                        </button>
                    </div>
                )}
                
                <div className='d-flex align-items-end flex-column'>
                    <PaginationComp
                        pageNo={this.state.pageNo}
                        pageSize={this.state.pageSize}
                        pageCount={Math.ceil(this.state.totalRowCount / this.state.pageSize)}
                        cb={this.updatePage.bind(this)} />
                </div>

                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col" className="text-end">Price</th>
                        <th scope="col" className="text-end">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.pageRows.map(product =>
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td className="text-end">${product.price.toFixed(2)}</td>
                                <td className="text-end">
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => this.addToCart(product)}>
                                        Add to Cart
                                    </button>
                                </td>
                            </tr>)
                    }
                    </tbody>
                </table>
            </>
        );
    }
}