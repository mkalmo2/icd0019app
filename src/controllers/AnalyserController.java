package controllers;

import inheritance.analyser.*;
import server.annotations.Controller;
import server.annotations.Get;
import server.annotations.Param;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Controller
public class AnalyserController {

    public record Response(
            Double totalSales,
            List<String> top3PopularItems,
            Double largestTotalSalesAmountForSingleItem) {
    }

    List<SalesRecord> records = List.of(
            new SalesRecord("Stapler", getDate("2009-08-03"), 1, 2),
            new SalesRecord("Markers", getDate("2010-09-04"), 2, 1),
            new SalesRecord("Markers", getDate("2011-01-07"), 2, 3),
            new SalesRecord("Notebooks", getDate("2012-07-15"), 3, 7),
            new SalesRecord("Stapler", getDate("2013-04-08"), 1, 2),
            new SalesRecord("Notebooks", getDate("2014-09-11"), 3, 6),
            new SalesRecord("Scissors", getDate("2024-01-01"), 6, 5),
            new SalesRecord("Envelopes", getDate("2024-11-05"), 3, 1),
            new SalesRecord("Scissors", getDate("2025-12-03"), 6, 1),
            new SalesRecord("Scissors", getDate("2025-10-22"), 7, 5));

    @Get("analyser/results")
    public Response resultsForRegion(@Param("region") String region) {
        AbstractSalesAnalyser analyser = switch (region) {
            case "Estonia" -> new EstonianTaxSalesAnalyser(records);
            case "Finland" -> new FinnishSalesAnalyser(records);
            case "TaxFree" -> new TaxFreeSalesAnalyser(records);
            default -> throw new IllegalArgumentException("unknown region");                    
        };

        
        return new Response(
                round(analyser.getTotalSales()),
                analyser.getTop3PopularItems(), 
                round(analyser.getLargestTotalSalesAmountForSingleItem()));
    }

    private static LocalDate getDate(String date) {
        return LocalDate.parse(date);
    }

    private static double round(double value) {
        BigDecimal bd = new BigDecimal(value);
        bd = bd.setScale(2, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }

}
