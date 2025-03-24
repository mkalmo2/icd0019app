import React, { Component } from 'react';
import ServiceCartDao from "./ServiceCartDao.ts";
import PaginationComp from "../top-sales/PaginationComp.tsx";

type Service = {
    id: string,
    price: number
}

type Result = {
    pageRows: Service[],
    totalRowCount: number,
}

type State = {
    pageNo: number,
    pageSize: number,
    totalRowCount: number,
    pageRows: Service[],
    coupon: string,
    statusMessage: string
}

const dao = new ServiceCartDao();

export default class ServicesListComp extends Component<{}, {}> {

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

    async addToCart(service: Service) {
        try {
            await dao.addItem(service.id);
            this.setState({ statusMessage: `Service "${service.id}" added to cart` });
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
                statusMessage: `Coupon "${this.state.coupon}" applied to services`,
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
                    <h4>Services</h4>
                    <div>
                        <a 
                            href="#/cart/services/cart"
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
                        this.state.pageRows.map(service =>
                            <tr key={service.id}>
                                <td>{service.id}</td>
                                <td className="text-end">${service.price.toFixed(2)}</td>
                                <td className="text-end">
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => this.addToCart(service)}>
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