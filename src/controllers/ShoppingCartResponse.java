package controllers;

import java.util.List;

public record ShoppingCartResponse(
        List<CartRow> rows,
        Double totalDiscount,
        Double total) {
}
