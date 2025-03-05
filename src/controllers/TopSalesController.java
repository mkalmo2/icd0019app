package controllers;

import junit.sales.SalesRecord;
import junit.sales.SalesRecordResult;
import junit.sales.TopSalesFinder;
import server.annotations.*;

@Controller
public class TopSalesController {

    private final TopSalesFinder finder = new TopSalesFinder();

    public TopSalesController() {
        finder.registerSale(new SalesRecord("Staples", 1, 1));
        finder.registerSale(new SalesRecord("Staples", 1, 2));
        finder.registerSale(new SalesRecord("Staples", 1, 3));
        finder.registerSale(new SalesRecord("Paper", 2, 1));
        finder.registerSale(new SalesRecord("Paper", 2, 2));
        finder.registerSale(new SalesRecord("Paper", 2, 3));
        finder.registerSale(new SalesRecord("Marker", 3, 1));
        finder.registerSale(new SalesRecord("Marker", 3, 2));
        finder.registerSale(new SalesRecord("Marker", 3, 3));
    }

    @Post("sales-records")
    public SalesRecord addSalesRecord(SalesRecord r) {
        SalesRecord newRecord = new SalesRecord(
                r.productId(), r.productPrice(), r.itemsSold());

        finder.registerSale(newRecord);

        return newRecord;
    }

    @Delete("sales-records")
    public void deleteRecord(@Param("id") String uuid) {
        finder.removeRecord(uuid);
    }

    @Get("sales-records/all")
    public Object getAllSalesRecordsPaged(@Param("pageNo") Integer pageNo,
                                          @Param("pageSize") Integer pageSize) {

        record Result(SalesRecord[] pageRows, int totalRowCount) {}

        return new Result(finder.getAllRecordsPaged(pageNo, pageSize), finder.getRecordCount());
    }

    @Get("sales-records/over")
    public SalesRecordResult[] getSalesOverAmount(@Param("amount") Integer amount) {
        return finder.findItemsSoldOver(amount);
    }

}
