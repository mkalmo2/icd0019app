import React, { Component } from 'react';
import FpAnalyserDao from "./FpAnalyserDao.ts";
import PaginationComp from "../top-sales/PaginationComp.tsx";

type Entry = {
    rowNo: number,
    productId: string,
    date: string,
    state: string,
    category: string,
    amount: number
}

type Result = {
    pageRows: Entry[],
    totalRowCount: number,
}

type State = {
    pageNo: number,
    pageSize: number,
    totalRowCount: number,
    pageRows: Entry[]
}

const dao = new FpAnalyserDao();

export default class FpAnalyserListComp extends Component<{}, {}> {

    state: State = {
        pageNo: 0,
        pageSize: 3,
        totalRowCount: 0,
        pageRows: []
    }

    async componentDidMount() {
        await this.refreshRows();
    }

    async refreshRows() {
        const result = await dao.getAllEntries(
            this.state.pageNo, this.state.pageSize) as Result;

        this.setState({pageRows: result.pageRows, totalRowCount: result.totalRowCount });
    }

    async updatePage(pageNo: number, pageSize: number) {
        this.setState({pageNo, pageSize}, async () => {
            await this.refreshRows();
        });
    }

    render() {
        return (
            <>
                <div className='d-flex align-items-end flex-column'>
                    <PaginationComp
                        pageNo={this.state.pageNo}
                        pageSize={this.state.pageSize}
                        pageCount={Math.ceil(this.state.totalRowCount / this.state.pageSize)}
                        cb={ this.updatePage.bind(this) } />
                </div>

                <table className="table test-border">
                    <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Product ID</th>
                        <th scope="col">Category</th>
                        <th scope="col">State</th>
                        <th scope="col" className="text-end">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.pageRows.map(entry =>
                            <tr key={ entry.rowNo }>
                                <td>{ entry.date }</td>
                                <td>{ entry.productId }</td>
                                <td>{ entry.category }</td>
                                <td>{ entry.state }</td>
                                <td className="text-end">{ entry.amount }</td>
                            </tr>)
                    }
                    </tbody>
                </table>
            </>
        );
    }
}