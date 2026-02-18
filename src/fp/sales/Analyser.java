package fp.sales;

import java.time.LocalDate;
import java.util.List;

public class Analyser {

    private final Repository repository;

    private final AccountingService accountingService;

    public Analyser(Repository repository,
                    AccountingService accountingService) {
        this.repository = repository;
        this.accountingService = accountingService;
    }

    public Double getTotalSales() {
        throw new RuntimeException("not implemented yet");
    }

    public Double getSalesByCategory(String category) {
        throw new RuntimeException("not implemented yet");
    }

    public Double getSalesBetween(LocalDate start, LocalDate end) {
        throw new RuntimeException("not implemented yet");
    }

    public String mostExpensiveItems() {
        throw new RuntimeException("not implemented yet");
    }

    public String statesWithBiggestSales() {
        throw new RuntimeException("not implemented yet");
    }

    public String findMostProfitableItems() {
        throw new RuntimeException("not implemented yet");
    }

    public List<Entry> getAllRecordsPaged(int pageNumber, int pageSize) {
        throw new RuntimeException("not implemented yet");
    }

    public List<String> getCategoryList() {
        // only needed for icd0019app

        return List.of();
    }

    public int getRecordCount() {
        // only needed for icd0019app

        return 0;
    }

}
