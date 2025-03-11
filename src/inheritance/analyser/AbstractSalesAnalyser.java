package inheritance.analyser;

import java.util.List;

public abstract sealed class AbstractSalesAnalyser
        permits EstonianTaxSalesAnalyser, FinnishSalesAnalyser, TaxFreeSalesAnalyser {

    public AbstractSalesAnalyser(List<SalesRecord> records) {
    }

    public Double getTotalSalesByProductId(String id) {
        return 0.0;
    }

    public Double getTotalSales() {
        return 0.0;
    }

    private Double getTotalWithoutVat(SalesRecord record) {
        return 0.0;
    }

    public List<String> getTop3PopularItems() {
        return List.of();
    }

    public Double getLargestTotalSalesAmountForSingleItem() {
        return 0.0;
    }
}
