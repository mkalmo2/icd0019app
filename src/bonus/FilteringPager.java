package bonus;

import java.util.List;

public class FilteringPager {

    @SuppressWarnings("PMD.UnusedPrivateField")
    private final SimplePager dataSource;
    @SuppressWarnings("PMD.UnusedPrivateField")
    private final int pageSize;

    public FilteringPager(SimplePager dataSource, int pageSize) {
        this.dataSource = dataSource;
        this.pageSize = pageSize;
    }

    public List<String> getNextPage() {
        return List.of();
    }

    public List<String> getCurrentPage() {
        return List.of();
    }

    public List<String> getPreviousPage() {
        throw new RuntimeException("not implemented yet");
    }

    public boolean hasNextPage() {
        return false;
    }

    public boolean hasPreviousPage() {
        return false;
    }

    public int getCurrentPageNo() {
        return 0;
    }

}
