import React, { Component } from 'react';
import CustomersDao, { CustomerRow, CustomerType } from "./CustomersDao.ts";
import PaginationComp from "../top-sales/PaginationComp.tsx";
import BonusModal from "./BonusModal.tsx";

type State = {
    name: string,
    type: string,
    points: number,
    pageNo: number,
    pageSize: number,
    totalRowCount: number,
    pageRows: CustomerRow[],
    customerTypes: CustomerType[],
    showBonusModal: boolean,
    selectedCustomer: CustomerRow | null
}

const dao = new CustomersDao();

export default class CustomersListComp extends Component<{}, {}> {

    state: State = {
        name: '',
        type: '',
        points: undefined,
        pageNo: 0,
        pageSize: 3,
        totalRowCount: 0,
        pageRows: [],
        customerTypes: [],
        showBonusModal: false,
        selectedCustomer: null
    }

    async componentDidMount() {
        await this.loadCustomerTypes();
        await this.refreshRows();
    }

    async loadCustomerTypes() {
        const types = await dao.getCustomerTypes();
        this.setState({
            customerTypes: types,
            type: types.length > 0 ? types[0].type : ''
        });
    }

    async refreshRows() {
        const result = await dao.getAllCustomers(
            this.state.pageNo, this.state.pageSize);

        this.setState({
            pageRows: result.pageRows,
            totalRowCount: result.totalRowCount
        });
    }

    async addNewCustomer() {
        await dao.addCustomer(
            this.state.name,
            this.state.type,
            this.state.points || 0
        );

        this.setState({
            name: '',
            points: undefined,
            type: this.state.customerTypes.length > 0 ? this.state.customerTypes[0].type : ''
        });

        await this.refreshRows();
    }

    async deleteCustomer(id: string) {
        await dao.deleteCustomer(id);
        await this.refreshRows();
    }

    async updatePage(pageNo: number, pageSize: number) {
        this.setState({pageNo, pageSize}, async () => {
            await this.refreshRows();
        });
    }

    getTypeLabel(typeValue: string): string {
        const typeEntry = this.state.customerTypes.find(type => type.type === typeValue);
        return typeEntry ? typeEntry.label : typeValue;
    }

    openBonusModal(customer: CustomerRow) {
        this.setState({
            showBonusModal: true,
            selectedCustomer: customer
        });
    }

    closeBonusModal() {
        this.setState({
            showBonusModal: false,
            selectedCustomer: null
        });
    }

    async collectBonus(orderAmount: number, orderDate: string) {
        const { selectedCustomer } = this.state;

        if (!selectedCustomer) {
            return;
        }

        try {
            await dao.collectBonus(selectedCustomer.id, orderAmount, orderDate);
            this.closeBonusModal();
            await this.refreshRows();
        } catch (error) {
            console.error('Error collecting bonus:', error);
        }
    }

    render() {
        return (
            <>
                <div className='d-flex align-items-end flex-column'>
                    <PaginationComp
                        pageNo={this.state.pageNo}
                        pageSize={this.state.pageSize}
                        pageCount={Math.ceil(this.state.totalRowCount / this.state.pageSize)}
                        cb={this.updatePage.bind(this)} />
                </div>

                <table className="table test-border">
                    <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Type</th>
                        <th scope="col">Points</th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.pageRows.map(row =>
                            <tr key={row.id}>
                                <td>{row.name}</td>
                                <td>{this.getTypeLabel(row.type)}</td>
                                <td>{row.points}</td>
                                <td className="text-end">
                                    <span className="loyalty-icon me-3"
                                          onClick={() => this.openBonusModal(row)}></span>
                                    <span className="delete-icon"
                                          onClick={() => this.deleteCustomer(row.id)}></span>
                                </td>
                            </tr>)
                    }
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>
                            <input
                                className="name"
                                value={this.state.name}
                                onChange={(e: any) => this.setState({ name: e.target.value })}
                                type="text"
                                placeholder="Customer name"
                            />
                        </td>
                        <td>
                            <select
                                value={this.state.type}
                                onChange={(e: any) => this.setState({ type: e.target.value })}
                                className="form-select"
                            >
                                {this.state.customerTypes.map(type => (
                                    <option key={type.type} value={type.type}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <input
                                className="number"
                                value={this.state.points ?? ''}
                                onChange={(e: any) => this.setState({ points: e.target.value })}
                                type="text"
                                placeholder="Points"
                            />
                        </td>
                        <td className="text-end">
                            <button
                                type="button"
                                id="add-button"
                                onClick={() => this.addNewCustomer()}
                                className="btn btn-success btn-sm"
                            >
                                Add
                            </button>
                        </td>
                    </tr>
                    </tfoot>
                </table>

                {this.state.showBonusModal && this.state.selectedCustomer && (
                    <BonusModal
                        name={this.state.selectedCustomer.name}
                        type={this.getTypeLabel(this.state.selectedCustomer.type)}
                        onClose={() => this.closeBonusModal()}
                        onCollectBonus={(amount, date) => this.collectBonus(amount, date)}
                    />
                )}
            </>
        );
    }
}
