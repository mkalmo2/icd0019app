package controllers;

import fp.sales.AccountingService;
import fp.sales.Analyser;
import fp.sales.Entry;
import fp.sales.Repository;
import server.annotations.*;

import java.time.LocalDate;
import java.util.List;

@Controller
public class FpController {

    private final Analyser analyser = new Analyser(new Repository(), new AccountingService());

    public record Response(
            Double totalSales,
            String mostExpensive,
            List<String> categoryList) {
    }

    @Get("fp/common-results")
    public Response getCommonResults() {
        return new Response(
                analyser.getTotalSales(),
                analyser.mostExpensiveItems(),
                analyser.getCategoryList());
    }

    @Get("fp/sales-by-category")
    public double getSalesByCategory(@Param("category") String category) {
        return analyser.getSalesByCategory(category);
    }

    @Get("fp/sales-between-dates")
    public double getSalesByCategory(
            @Param("start") String start,
            @Param("end") String end) {
        return analyser.getSalesBetween(
                LocalDate.parse(start),
                LocalDate.parse(end));
    }

    @Get("fp/all")
    public Object getAllEntriesPaged(@Param("pageNo") Integer pageNo,
                                     @Param("pageSize") Integer pageSize) {

        record Result(List<Entry> pageRows, int totalRowCount) {}

        return new Result(analyser.getAllRecordsPaged(pageNo, pageSize),
                          analyser.getRecordCount());
    }

}
