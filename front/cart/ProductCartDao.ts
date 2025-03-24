import {CartDao} from "./CartDao.ts";
import Http from "../common/Http.ts";
import CartInfo from "./CartInfo";

export default class ProductCartDao implements CartDao {

    private http: Http;

    constructor() {
        this.http = new Http('api/');
    }

    getItems(pageNo: number, pageSize: number): Promise<any> {
        return this.http.get(`cart/products?pageNo=${pageNo}&pageSize=${pageSize}`);
    }

    addItem(itemId: string): Promise<void> {
        return this.http.post(`cart/add-product?productId=${encodeURIComponent(itemId)}`);
    }

    getCartInfo(): Promise<CartInfo> {
        return this.http.get(`cart/products-cart-info`);
    }

    removeItem(itemId: string): Promise<void> {
        return this.http.post(`cart/remove-product?productId=${encodeURIComponent(itemId)}`);
    }

    increaseItemQuantity(itemId: string): Promise<void> {
        return this.http.post(`cart/increase-product–quantity?productId=${encodeURIComponent(itemId)}`);
    }

    applyCoupon(coupon: string): Promise<{ success: boolean }> {
        return this.http.post(
            `cart/apply-coupon-to-products?coupon=${encodeURIComponent(coupon)}`);
    }
}