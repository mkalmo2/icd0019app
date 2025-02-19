package server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

public class StaticFileHandler implements HttpHandler {
    private final Path baseDir;

    public StaticFileHandler(String directory) {
        this.baseDir = Paths.get(directory).toAbsolutePath();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        path = "/".equals(path) ? "/index.html" : path;
        Path filePath = baseDir.resolve(path.substring(1)).normalize();

        if (!filePath.startsWith(baseDir) || !Files.exists(filePath) || Files.isDirectory(filePath)) {
            sendResponse(exchange, 404, "File not found");
            return;
        }

        byte[] content = Files.readAllBytes(filePath);

        exchange.getResponseHeaders().add("Content-Type", getContentType(path));

        exchange.sendResponseHeaders(200, content.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(content);
        }
    }

    private String getContentType(String path) {
        String extension = path.substring(path.lastIndexOf('.') + 1);
        var map = Map.of(
                "js", "application/javascript",
                "css", "text/css",
                "html", "text/html");

        return map.getOrDefault(extension, "text/plain");
    }

    private void sendResponse(HttpExchange exchange,
                              int statusCode, String message) throws IOException {

        byte[] response = message.getBytes();
        exchange.sendResponseHeaders(statusCode, response.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(response);
        }
    }
}
