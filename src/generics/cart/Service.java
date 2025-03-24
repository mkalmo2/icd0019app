package generics.cart;

public record Service(String id, Double price) implements CartItem {

    public Service(String id, Integer price) {
        this(id, Double.valueOf(price));
    }

}
