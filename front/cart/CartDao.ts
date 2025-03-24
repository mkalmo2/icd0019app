import CartInfo from "./CartInfo";

export interface CartDao {
    getItems(pageNo: number, pageSize: number): Promise<any>;
    addItem(itemId: string): Promise<void>;

    getCartInfo(): Promise<CartInfo>;
    removeItem(itemId: string): Promise<void>;
    increaseItemQuantity(itemId: string): Promise<void>;
    applyCoupon(coupon: string): Promise<{ success: boolean }>;
}
