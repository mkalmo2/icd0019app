import Http from "../common/Http.ts";
import PagerResult from "./PagerResult.ts";

export default class PagerDao {

    private http: Http;

    constructor() {
        this.http = new Http('api/');
    }

    currentPage(): Promise<PagerResult> {
        return this.http.get('pager/current-page');
    }

    nextPage(): Promise<PagerResult> {
        return this.http.get('pager/next-page');
    }

    previousPage(): Promise<PagerResult> {
        return this.http.get('pager/previous-page');
    }

}
