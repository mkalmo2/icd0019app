package junit.sales;

import java.util.UUID;

public class TopSalesFinder {

    private final SalesRecordList records = new SalesRecordList();

    public void registerSale(SalesRecord record) {
        records.add(record);
    }

    public SalesRecordResult[] findItemsSoldOver(int amount) {

        ArrayMap map = new ArrayMap();
        for (SalesRecord record : records.getArray()) {
            int total = 0;
            if (map.containsKey(record.productId())) {
                total = map.get(record.productId()).total();
            }
            total += record.productPrice() * record.itemsSold();
            map.put(record.productId(), new SalesRecordResult(record.productId(), total));
        }

        SalesRecordResult[] tmpStore = new SalesRecordResult[map.keySet().length];
        int keyCount = 0;
        for (String key : map.keySet()) {
            SalesRecordResult salesRecordResult = map.get(key);
            if (salesRecordResult.total() > amount) {
                tmpStore[keyCount++] = salesRecordResult;
            }
        }

        SalesRecordResult[] keys = new SalesRecordResult[keyCount];
        for (int i = 0; i < keyCount; i++) {
            keys[i] = tmpStore[i];
        }

        return keys;
    }

    public void removeSalesRecordsFor(String id) {
        SalesRecordList toRemove = new SalesRecordList();
        for (SalesRecord salesRecord : records.getArray()) {
            if (salesRecord.productId().equals(id)) {
                toRemove.add(salesRecord);
            }
        }

        for (SalesRecord salesRecord : toRemove.getArray()) {
            records.remove(salesRecord);
        }
    }

    public SalesRecord[] getAllRecordsPaged(int pageNumber, int pageSize) {
        SalesRecord[] allRecords = records.getArray();

        int startIndex = Math.max(0, pageNumber) * pageSize;
        if (startIndex >= allRecords.length) {
            return new SalesRecord[0];
        }

        int endIndex = startIndex + pageSize;
        if (endIndex > allRecords.length) {
            endIndex = allRecords.length;
        }

        int numItems = endIndex - startIndex;
        SalesRecord[] pageRecords = new SalesRecord[numItems];

        for (int i = 0; i < numItems; i++) {
            pageRecords[i] = allRecords[startIndex + i];
        }

        return pageRecords;
    }

    public int getRecordCount() {
        return records.getArray().length;
    }

    public void removeRecord(String uuid) {
        for (SalesRecord salesRecord : records.getArray()) {
            if (salesRecord.recordId().equals(UUID.fromString(uuid))) {
                records.remove(salesRecord);
            }
        }
    }

}


