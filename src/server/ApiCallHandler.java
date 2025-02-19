package server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class ApiCallHandler implements HttpHandler {
    private final String pathPrefix;

    public ApiCallHandler(String pathPrefix) {
        this.pathPrefix = pathPrefix;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String body;
        try (InputStream is = exchange.getRequestBody()) {
            byte[] bytes = is.readAllBytes();
            body = new String(bytes);
        }

        String path = exchange.getRequestURI().getPath()
                .replaceFirst(pathPrefix, "");
        String query = exchange.getRequestURI().getQuery();

        String method = exchange.getRequestMethod();

        String jsonResult = new Dispatcher().execute(
                method, path, body, new QueryParser(query).getParameters());

        exchange.getResponseHeaders().add("Content-Type", "text/html");
        exchange.sendResponseHeaders(200, jsonResult.length());

        try (OutputStream os = exchange.getResponseBody()) {
            os.write(jsonResult.getBytes());
        }
    }
}
