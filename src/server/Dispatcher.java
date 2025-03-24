package server;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import server.annotations.Delete;
import server.annotations.Get;
import server.annotations.Post;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class Dispatcher {
    
    private final List<Object> controllers;
    
    public Dispatcher() {
        this.controllers = new PackageScanner("controllers").findControllers();
    }

    public String execute(String httpMethod, String path,
                          String json, Map<String, Object> map) throws JsonProcessingException {

        Optional<MethodWrapper> optionalMethod = findMethodFromControllers(path, httpMethod);

        MethodWrapper method = optionalMethod.orElseThrow(
                () -> new RuntimeException(String.format("no such path for method: '%s' %s",
                    httpMethod, path)));

        List<Object> parameters = new ArrayList<>();
        for (ParameterWrapper parameter : method.getParameters()) {
            if (parameter.name() != null) {
                Object converted = convert(map.get(parameter.name()), parameter.type());

                parameters.add(converted);
            } else {
                parameters.add(new ObjectMapper().readValue(json, parameter.type()));
            }
        }

        Object result = method.execute(parameters.toArray());

        return new ObjectMapper().writeValueAsString(result);
    }

    private Object convert(Object value, Class<?> type) {
        if (type == String.class) {
            return value.toString();
        } else if (type == Integer.class) {
            return Integer.parseInt(value.toString());
        } else if (type == Double.class) {
            return Double.parseDouble(value.toString());
        }

        throw new IllegalArgumentException("unexpected type: " + type);
    }

    private Optional<MethodWrapper> findMethodFromControllers(String path, String httpMethod) {
        for (Object controller : controllers) {
            Optional<MethodWrapper> methodWrapper = findMethodFromObject(path, httpMethod, controller);
            if (methodWrapper.isPresent()) {
                return methodWrapper;
            }
        }
        
        return Optional.empty();
    }
    
    private static Optional<MethodWrapper> findMethodFromObject(
            String path, String httpMethod, Object controller) {

        Method[] methods = controller.getClass().getDeclaredMethods();

        for (Method method : methods) {
            String pathFromAnnotation = getAnnotationValue(httpMethod, method);

            if (path.equals(pathFromAnnotation)) {
                return Optional.of(new MethodWrapper(controller, method));
            }
        }

        return Optional.empty();
    }

    private static String getAnnotationValue(String httpMethod, Method method) {
        Annotation annotation = switch (httpMethod) {
            case "DELETE" -> method.getAnnotation(Delete.class);
            case "POST" -> method.getAnnotation(Post.class);
            case "GET" -> method.getAnnotation(Get.class);
            default -> null;
        };

        if (annotation == null) {
            return null;
        }

        return switch (annotation) {
            case Get g -> g.value();
            case Post p -> p.value();
            case Delete p -> p.value();
            default -> throw new RuntimeException("unknown annotation: " + annotation);
        };
    }

}
