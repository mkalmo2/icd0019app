package generics.cart;

public class CartEntry {

    public final CartItem item;
    public Integer quantity;

    public CartEntry(CartItem item, Integer quantity) {
        this.item = item;
        this.quantity = quantity;
    }

    @Override
    public String toString() {
        return String.format("(%s, %s, %s)",
                item.id(), item.price(), quantity);
    }
}
