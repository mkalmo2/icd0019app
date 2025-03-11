package inheritance.analyser;

import java.time.LocalDate;

public record SalesRecord(String productId,
                          LocalDate date,
                          Double productPrice,
                          Integer itemsSold) {

    public SalesRecord(String productId, LocalDate date,
                       Integer productPrice, Integer itemsSold) {
        this(productId, date, Double.valueOf(productPrice), itemsSold);
    }
}
