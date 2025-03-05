package controllers;

import inheritance.pager.FilteringPager;
import inheritance.pager.SimplePager;
import server.annotations.Controller;
import server.annotations.Get;

import java.util.Arrays;
import java.util.List;

@Controller
public class PagerController {

    private static final int PAGE_SIZE = 4;

    private static final FilteringPager pager;

    public record Response(List<String> pageRows,
                           int pageSize,
                           int currentPageNo,
                           boolean hasNextPage,
                           boolean hasPreviousPage) {}

    static {
        List<String> data = Arrays.asList(
                "Stapler", null, null, "Paper",
                "Markers", null, "Pens", "Pencils",
                "Notebooks", "Paper Clips", null,
                "Scissors", null, "Tape", "Sticky Notes",
                "Highlighters", "Folders", null, null, "Printer Ink",
                "Envelopes", null,
                "Desk Organizer", null, null, null);

        SimplePager simplePager = new SimplePager(data, 3);

        pager = new FilteringPager(simplePager, PAGE_SIZE);

        pager.getNextPage();
    }

    private Response createResponse(List<String> page) {
        return new Response(page,
                PAGE_SIZE,
                pager.getCurrentPageNo(),
                pager.hasNextPage(),
                pager.hasPreviousPage());
    }

    @Get("pager/current-page")
    public Response currentPage() {
        return createResponse(pager.getCurrentPage());
    }

    @Get("pager/next-page")
    public Response nextPage() {
        return createResponse(pager.getNextPage());
    }

    @Get("pager/previous-page")
    public Response previousPage() {
        return createResponse(pager.getPreviousPage());
    }
}
