import Http from "./Http.ts";

export default class Dao {

    private http: Http;

    constructor() {
        this.http = new Http('api/');
    }

    getSalesRecordsOver(amount: number): Promise<string[]> {
        return this.http.get(`sales-records/over?amount=${amount}`);
    }

    getAllSalesRecords(pageNo: number, pageSize: number): Promise<string[]> {
        return this.http.get(`sales-records/all?pageNo=${pageNo}&pageSize=${pageSize}`);
    }

    addSalesRecord(name: string, price: number, quantity: number): Promise<void> {
        const record = {
            productId: name,
            productPrice: price,
            itemsSold: quantity
        }

        return this.http.post(`sales-records`, record);
    }

    deleteRecord(id: string): Promise<void> {
        return this.http.delete(`sales-records?id=${id}`);
    }
}
