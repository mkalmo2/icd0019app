package generics.cart;

public record Product(String id, Double price) implements CartItem {

    public Product(String id, Integer price) {
        this(id, Double.valueOf(price));
    }
}
