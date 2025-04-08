import Http from "../common/Http.ts";

export type CustomerRow = {
    id: string,
    type: string,
    name: string,
    points: number
}

export type CustomerType = {
    type: string,
    label: string
}

export type CustomersResult = {
    pageRows: CustomerRow[],
    totalRowCount: number
}

export default class CustomersDao {
    private http: Http;

    constructor() {
        this.http = new Http('api/');
    }

    getAllCustomers(pageNo: number, pageSize: number): Promise<CustomersResult> {
        return this.http.get(`customers?pageNo=${pageNo}&pageSize=${pageSize}`);
    }

    async getCustomerTypes(): Promise<CustomerType[]> {
        const response = await this.http.get('customers/types') as string[][];
        return response.map(type => ({
            type: type[0],
            label: type[1]
        }));
    }

    addCustomer(name: string, type: string, points: number): Promise<CustomerRow> {
        const customer = {
            name,
            type,
            points
        };

        return this.http.post('customers', customer);
    }

    deleteCustomer(id: string): Promise<void> {
        return this.http.delete(`customers?id=${id}`);
    }

    collectBonus(id: string, amount: number, date: string): Promise<CustomerRow> {
        return this.http.post(
            `customers/collect-bonus?customerId=${id}&orderAmount=${amount}&lastOrderDate=${date}`);
    }
}
