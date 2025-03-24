package controllers;

import java.util.ArrayList;
import java.util.List;

public class ListPager<T> {
    private final List<T> items;

    public ListPager(List<T> items) {
        if (items == null) {
            throw new IllegalArgumentException("List cannot be null");
        }
        this.items = items;
    }

    public List<T> getAllPaged(int pageNumber, int pageSize) {
        if (pageNumber < 0) {
            throw new IllegalArgumentException("Page number must be greater than or equal to 0");
        }
        
        if (pageSize <= 0) {
            throw new IllegalArgumentException("Page size must be greater than 0");
        }
        
        if (items.isEmpty() || pageNumber * pageSize >= items.size()) {
            return new ArrayList<>();
        }
        
        int startIndex = pageNumber * pageSize;
        int endIndex = Math.min(startIndex + pageSize, items.size());
        
        return new ArrayList<>(items.subList(startIndex, endIndex));
    }
    
    public int getTotalItems() {
        return items.size();
    }
}