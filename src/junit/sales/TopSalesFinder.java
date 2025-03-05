package junit.sales;

public class TopSalesFinder {

    public void registerSale(SalesRecord record) {

        // store sales record for later analyses by findItemsSoldOver()

    }

    public SalesRecordResult[] findItemsSoldOver(int amount) {

        // find ids of records that sold over specified amount.

        return new SalesRecordResult[0];
    }

    public void removeSalesRecordsFor(String id) {

        // removes records with specified id
    }

    public SalesRecord[] getAllRecordsPaged(int pageNumber, int pageSize) {

        // return a slice of all stored records

        return new SalesRecord[0];
    }

    public int getRecordCount() {
        // only needed for the sample application

        // returns the count of all records

        return 0;
    }

    public void removeRecord(String id) {
        // only needed for the sample application

        // removes record with specific id
    }

}


