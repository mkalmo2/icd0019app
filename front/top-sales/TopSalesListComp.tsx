import React, { useState, useEffect, Component } from 'react';
import Dao from "../common/Dao.ts";
import PaginationComp from "./PaginationComp.tsx";

type Row = {
    recordId: string,
    productId: string,
    productPrice: number;
    itemsSold: number
}

type Result = {
    pageRows: Row[],
    totalRowCount: number,
}

type State = {
    name: string,
    price: number,
    quantity: number,
    pageNo: number,
    pageSize: number,
    totalRowCount: number,
    pageRows: Row[]
}

const dao = new Dao();

export default class TopSalesListComp extends Component<{}, {}> {

    state: State = {
        name: undefined,
        price: undefined,
        quantity: undefined,
        pageNo: 0,
        pageSize: 3,
        totalRowCount: 0,
        pageRows: []
    }

    async componentDidMount() {
        await this.refreshRows();
    }

    async refreshRows() {
        const result = await dao.getAllSalesRecords(
            this.state.pageNo, this.state.pageSize) as Result;

        this.setState({pageRows: result.pageRows, totalRowCount: result.totalRowCount });
    }

    async addNewRecord() {
        await dao.addSalesRecord(this.state.name, this.state.price, this.state.quantity);

        this.setState({name: '', price: undefined, quantity: undefined});

        await this.refreshRows();
    }

    async deleteRecord(id: string) {
        await dao.deleteRecord(id);

        await this.refreshRows();
    }

    async updatePage(pageNo: number, pageSize: number) {
        this.setState({pageNo, pageSize}, async () => {
            await this.refreshRows();
        });

    }

    render() {
        return (
            <>
                <PaginationComp
                    pageNo={this.state.pageNo}
                    pageSize={this.state.pageSize}
                    pageCount={Math.ceil(this.state.totalRowCount / this.state.pageSize)}
                    cb={ this.updatePage.bind(this) } />

                <table className="table test-border">
                    <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col" className="text-end">Total</th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.pageRows.map(row =>
                            <tr key={ row.recordId }>
                                <td>{ row.productId }</td>
                                <td>{ row.productPrice }</td>
                                <td>{ row.itemsSold }</td>
                                <td className="text-end">{ row.productPrice * row.itemsSold }</td>
                                <td className="text-end">
                                    <span className="delete-icon"
                                          onClick={() => this.deleteRecord(row.recordId)}></span>
                                </td>
                            </tr>)
                    }
                    </tbody>
                    <tfoot>
                    <tr>
                        <td><input className="name"
                                   value={this.state.name}
                                   onChange={(e: any) => this.setState({ name: e.target.value }) }
                                   type="text"/></td>
                        <td><input className="number"
                                   value={this.state.price ?? ''}
                                   onChange={(e: any) => this.setState({ price: e.target.value }) }
                                   type="text"/></td>
                        <td><input className="number"
                                   value={this.state.quantity ?? ''}
                                   onChange={(e: any) => this.setState({ quantity: e.target.value }) }
                                   type="text"/></td>
                        <td></td>
                        <td className="text-end">
                            <button type="button" id="add-button"
                                    onClick={() => this.addNewRecord()}
                                    className="btn btn-success btn-sm">Add
                            </button>
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </>
        );
    }
}
