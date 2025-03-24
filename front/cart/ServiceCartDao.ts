import {CartDao} from "./CartDao.ts";
import Http from "../common/Http.ts";
import CartInfo from "./CartInfo";

export default class ServiceCartDao implements CartDao {

    private http: Http;

    constructor() {
        this.http = new Http('api/');
    }

    getItems(pageNo: number, pageSize: number): Promise<any> {
        return this.http.get(`cart/services?pageNo=${pageNo}&pageSize=${pageSize}`);
    }

    addItem(itemId: string): Promise<void> {
        return this.http.post(`cart/add-service?serviceId=${encodeURIComponent(itemId)}`);
    }

    getCartInfo(): Promise<CartInfo> {
        return this.http.get(`cart/services-cart-info`);
    }

    removeItem(itemId: string): Promise<void> {
        return this.http.post(`cart/remove-service?serviceId=${encodeURIComponent(itemId)}`);
    }

    increaseItemQuantity(itemId: string): Promise<void> {
        return this.http.post(`cart/increase-service–quantity?serviceId=${encodeURIComponent(itemId)}`);
    }

    applyCoupon(coupon: string): Promise<{ success: boolean }> {
        return this.http.post(
            `cart/apply-coupon-to-services?coupon=${encodeURIComponent(coupon)}`);
    }
}