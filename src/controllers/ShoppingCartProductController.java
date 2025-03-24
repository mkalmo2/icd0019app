package controllers;

import generics.cart.Product;
import generics.cart.ShoppingCart;
import server.annotations.Controller;
import server.annotations.Get;
import server.annotations.Param;
import server.annotations.Post;

import java.util.List;
import java.util.Map;

@Controller
public class ShoppingCartProductController {

    List<Product> products = List.of(
            new Product("Stapler", 3),
            new Product("Paper", 5),
            new Product("Pens", 1),
            new Product("Pencils", 1),
            new Product("Markers", 2),
            new Product("Highlighters", 2),
            new Product("Notebooks", 6),
            new Product("Printer Ink", 14),
            new Product("Tape", 3),
            new Product("Scissors", 12),
            new Product("Envelopes", 4));

    private final ShoppingCart<Product> cart = new ShoppingCart<>();

    @Get("cart/products")
    public Object products(@Param("pageNo") Integer pageNo,
                           @Param("pageSize") Integer pageSize) {

        record Result(List<Product> pageRows, int totalRowCount) {}

        ListPager<Product> pager = new ListPager<>(products);

        return new Result(pager.getAllPaged(pageNo, pageSize),
                          pager.getTotalItems());
    }

    @Post("cart/add-product")
    public void addProduct(@Param("productId") String id) {
        Product product = products.stream()
                .filter(p -> p.id().equals(id))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);

        cart.add(product);
    }

    @Get("cart/products-cart-info")
    public ShoppingCartResponse productsCartContents() {
        var rows = cart.getContents().stream()
                .map(e -> new CartRow(e.item.id(), e.item.price(), e.quantity)).toList();

        return new ShoppingCartResponse(
                rows,
                cart.getTotalDiscount(),
                cart.getTotal());
    }

    @Post("cart/remove-product")
    public void removeProduct(@Param("productId") String id) {
        cart.removeById(id);
    }

    @Post("cart/increase-product–quantity")
    public void increaseProductQuantity(@Param("productId") String id) {
        cart.increaseQuantity(id);
    }

    @Post("cart/apply-coupon-to-products")
    public Object applyCouponToProducts(@Param("coupon") String coupon) {

        record Response(boolean success) {}

        return new Response(cart.applyCoupon(coupon));
    }
}