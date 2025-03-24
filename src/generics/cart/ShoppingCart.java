package generics.cart;

import java.util.List;
import java.util.Map;

public class ShoppingCart<T> {

    private final Map<String, Double> couponToDiscount = Map.of(
            "Sale5", 5.0,
            "Sale8", 8.0,
            "Sale10", 10.0);

    public void add(Object item) {
    }

    public void removeById(String id) {
    }

    public Double getTotal() {
        return 0.0;
    }

    public List<CartEntry> getContents() {
        return List.of();
    }

    public void increaseQuantity(String id) {
    }

    public void applyDiscountPercentage(Double discount) {
    }

    public boolean applyCoupon(String coupon) {
        return false;
    }

    public Double getTotalDiscount() {
        return 0.0;
    }

    public void removeLastDiscount() {
    }

    public void addAll(Object items) {
    }
}
