package fp.sales;

import java.time.format.DateTimeFormatter;
import java.util.List;

public class Repository {

    private static final String FILE_PATH = "src/fp/sales/sales-data.csv";

    private DateTimeFormatter formatter = DateTimeFormatter
            .ofPattern("dd.MM.yyyy");

    public List<Entry> getEntries() {

        // reads lines form the file and creates entry objects for each line.

        throw new RuntimeException("not implemented yet");
    }

}
