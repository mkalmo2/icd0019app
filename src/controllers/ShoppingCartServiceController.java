package controllers;

import generics.cart.Service;
import generics.cart.ShoppingCart;
import server.annotations.Controller;
import server.annotations.Get;
import server.annotations.Param;
import server.annotations.Post;

import java.util.List;
import java.util.Map;

@Controller
public class ShoppingCartServiceController {

    List<Service> services = List.of(
            new Service("Engraving Services", 20),
            new Service("Equipment Repair", 20),
            new Service("Printer Cartridge Refilling", 15),
            new Service("Document Binding", 13),
            new Service("Business Card Printing", 14),
            new Service("Large Format Printing", 18),
            new Service("IT Supplies Consultation", 20),
            new Service("Same-Day Delivery", 10),
            new Service("Personalized Stationery", 25)
    );

    private final ShoppingCart<Service> cart = new ShoppingCart<>();

    @Get("cart/services")
    public Object services(@Param("pageNo") Integer pageNo,
                         @Param("pageSize") Integer pageSize) {

        record Result(List<Service> pageRows, int totalRowCount) {}

        ListPager<Service> pager = new ListPager<>(services);

        return new Result(pager.getAllPaged(pageNo, pageSize),
                          pager.getTotalItems());
    }

    @Post("cart/add-service")
    public void addService(@Param("serviceId") String id) {
        Service service = services.stream()
                .filter(s -> s.id().equals(id))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);

        cart.add(service);
    }

    @Get("cart/services-cart-info")
    public ShoppingCartResponse servicesCartContents() {
        var rows = cart.getContents().stream()
                .map(e -> new CartRow(e.item.id(), e.item.price(), e.quantity)).toList();

        return new ShoppingCartResponse(
                rows,
                cart.getTotalDiscount(),
                cart.getTotal());
    }

    @Post("cart/remove-service")
    public void removeService(@Param("serviceId") String id) {
        cart.removeById(id);
    }

    @Post("cart/increase-service–quantity")
    public void increaseServiceQuantity(@Param("serviceId") String id) {
        cart.increaseQuantity(id);
    }

    @Post("cart/apply-coupon-to-services")
    public Object applyCouponToServices(@Param("coupon") String coupon) {
        record Response(boolean success) {}

        return new Response(cart.applyCoupon(coupon));
    }
}