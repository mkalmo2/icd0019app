import Http from "../common/Http.ts";

export interface CommonResults {
    totalSales: number;
    mostExpensive: string;
    categoryList: string[];
}

export default class FpAnalyserDao {
    private http: Http;

    constructor() {
        this.http = new Http('api/');
    }

    getAllEntries(pageNo: number, pageSize: number): Promise<any> {
        return this.http.get(`fp/all?pageNo=${pageNo}&pageSize=${pageSize}`);
    }

    getCommonResults(): Promise<CommonResults> {
        return this.http.get('fp/common-results');
    }

    getSalesByCategory(category: string): Promise<number> {
        return this.http.get(`fp/sales-by-category?category=${encodeURIComponent(category)}`);
    }

    getSalesBetweenDates(start: string, end: string): Promise<number> {
        return this.http.get(`fp/sales-between-dates?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
    }
}