import React, { Component } from 'react';
import PagerDao from "./PagerDao.ts";
import PagerResult from "./PagerResult.ts";

const dao = new PagerDao();

export default class PagerComp extends Component<{}, {}> {

    state: PagerResult = {
        pageRows: [],
        pageSize: 0,
        currentPageNo: 0,
        hasNextPage: false,
        hasPreviousPage: false
    }

    async componentDidMount() {
        await this.refreshRows();
    }

    async refreshRows() {
        this.setState(await dao.currentPage());
    }

    async nextPage() {
        this.setState(await dao.nextPage());
    }

    async previousPage() {
        this.setState(await dao.previousPage());
    }

    render() {
        const pageStart = this.state.pageSize * this.state.currentPageNo;

        return (
            <>
            <div className='d-flex align-items-end flex-column'>
                <ul className="pagination mb-0">
                    <li className={ this.state.hasPreviousPage ? 'page-item' : 'page-item disabled'}>
                        <button
                            onClick={() => this.previousPage()}
                            className="page-link">&laquo;</button>
                    </li>
                    <li className={ this.state.hasNextPage ? 'page-item' : 'page-item disabled'}>
                        <button
                            onClick={() => this.nextPage()}
                            className="page-link">&raquo;</button>
                    </li>
                </ul>
            </div>

            <div className='pager'>
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col" className='number-col'>#</th>
                        <th scope="col">Item</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.pageRows.map((item, i) =>
                            <tr key={ i }>
                                <td>{ pageStart + i + 1 }</td>
                                <td>{ item }</td>
                            </tr>)
                    }
                    </tbody>
                </table>
            </div>
            </>
        );
    }
}
