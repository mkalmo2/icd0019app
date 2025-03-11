package inheritance.analyser;

import java.util.List;

public final class TaxFreeSalesAnalyser extends AbstractSalesAnalyser {

    public TaxFreeSalesAnalyser(List<SalesRecord> records) {
        super(records);
    }

}
