export default class Http {

    constructor(private baseUrl: string = "") {}

    get(url: string) {
        const headers = new Headers();

        const request = new Request(this.baseUrl + url, {
            method: 'GET',
            headers: headers
        });

        return fetch(request)
            .then(response => this.restrictedMatcher(response))
            .then(response => {
                if (response.status === 404) {
                    throw Error('404');
                }
                return response;
            })
            .then(response => response.json());
    }

    post(url: string, data: any = {}) {
        const options = {
            method: 'POST',
            headers: { "Content-type": "application/json"},
            body: JSON.stringify(data)
        };

        return fetch(this.baseUrl + url, options)
            .then(response => this.restrictedMatcher(response))
            .then(response => response.json());
    }

    delete(url: string) {
        const options = {
            method: 'DELETE'
        };

        return fetch(this.baseUrl + url, options)
            .then(response => this.restrictedMatcher(response))
            .then(response => response.json());
    }

    restrictedMatcher(response) {
        if (response.status === 401) {
            throw new Error('Unauthorized: ' + 401);
        }

        return response;
    }


}
