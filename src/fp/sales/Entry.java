package fp.sales;

import java.time.LocalDate;

public record Entry(int rowNo,
                    String productId,
                    LocalDate date,
                    String state,
                    String category,
                    Double amount) {

}
