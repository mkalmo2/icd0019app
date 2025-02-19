package server;

import com.sun.net.httpserver.HttpServer;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class Server {
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/", new StaticFileHandler("front"))
                .getFilters().add(new ExceptionLoggingFilter());

        server.createContext("/api", new ApiCallHandler("/api/"))
                .getFilters().add(new ExceptionLoggingFilter());

        server.start();

        System.out.println("Running at http://localhost:8080");
    }
}
