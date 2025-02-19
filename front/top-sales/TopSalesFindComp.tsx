import React, { Component } from 'react';
import Dao from "../common/Dao.ts";

type Row = {
    productId: string,
    total: number
}

type State = {
    amount: number,
    rows: Row[]
}

export default class TopSalesFindComp extends Component<{}, {}> {

    state: State = {
        amount: 0,
        rows: []
    }

    async componentDidMount() {
        await this.refreshRows();
    }

    async refreshRows() {
        const rows = await new Dao().getSalesRecordsOver(this.state.amount) as Row[];
        this.setState({rows});
    }

    updateAmount(amount: number) {
        this.setState({amount});
    }

    render() {
        return (
            <>
                <div className="input-group mb-3">
                    <input type="text" className="form-control"
                           value={this.state.amount}
                           onChange={(e: any) => this.updateAmount(e.target.value)}
                           placeholder="Item sales threshold"/>
                    <button className="btn btn-outline-success"
                            onClick={() => this.refreshRows()}
                            type="button" id="button-addon2">Find Items Sold Over
                    </button>
                </div>

                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">Item name</th>
                        <th scope="col" className="text-end">Sales total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.rows.map(row =>
                            <tr key={ row.productId }>
                                <td>{ row.productId }</td>
                                <td className="text-end">{ row.total }</td>
                            </tr>)
                    }
                    </tbody>
                </table>
            </>
        );
    }
}
