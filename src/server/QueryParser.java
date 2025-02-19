package server;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class QueryParser {

    private final Map<String, Object> parameters = new HashMap<>();

    public QueryParser(String queryString) {
        if (queryString == null || queryString.isEmpty()) {
            return;
        }

        String[] params = queryString.split("&");

        for (String param : params) {
            String[] keyValue = param.split("=", 2);
            if (keyValue.length == 2) {
                String value = keyValue[1];
                Object parsedValue = parseValue(value);
                parameters.put(keyValue[0], parsedValue);
            }
        }
    }

    private Object parseValue(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e1) {
            try {
                return Double.parseDouble(value);
            } catch (NumberFormatException e2) {
                return value;
            }
        }
    }

    public Map<String, Object> getParameters() {
        return Collections.unmodifiableMap(parameters);
    }

    @Override
    public String toString() {
        return "UrlParser{" +
                ", parameters=" + parameters +
                '}';
    }
}