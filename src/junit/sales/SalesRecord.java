package junit.sales;

import java.util.UUID;

public record SalesRecord(UUID recordId,
                          String productId,
                          int productPrice,
                          int itemsSold) {

    public SalesRecord(String productId, int productPrice, int itemsSold) {
        this(UUID.randomUUID(), productId, productPrice, itemsSold);
    }
}
