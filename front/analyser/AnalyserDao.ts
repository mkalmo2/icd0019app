import Http from "../common/Http.ts";
import AnalyserResult from "./AnalyserResult.ts";

export default class AnalyserDao {

    private http: Http;

    constructor() {
        this.http = new Http('api/');
    }

    getResults(region: string): Promise<AnalyserResult> {
        return this.http.get(`analyser/results?region=${region}`);
    }
}