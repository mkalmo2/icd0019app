package server;

import com.sun.net.httpserver.Filter;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;

public class ExceptionLoggingFilter extends Filter {
    @Override
    public void doFilter(HttpExchange exchange, Chain chain) throws IOException {
        try {
            chain.doFilter(exchange);
        } catch (Exception e) {
            e.printStackTrace();
            String error = "Internal Server Error";
            exchange.sendResponseHeaders(500, error.length());
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(error.getBytes());
            }
        }
    }

    @Override
    public String description() {
        return "Logs exceptions and returns HTTP 500";
    }
}
