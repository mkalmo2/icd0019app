package server;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import controllers.TopSalesController;
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

    public String execute(String httpMethod, String path,
                          String json, Map<String, Object> map) throws JsonProcessingException {

        Optional<MethodWrapper> optionalMethod = findMethodFromObject(path, httpMethod,
                new TopSalesController());

        MethodWrapper method = optionalMethod.orElseThrow(
                () -> new RuntimeException(String.format("no such path for method: '%s' %s",
                    httpMethod, path)));

        List<Object> parameters = new ArrayList<>();
        for (ParameterWrapper parameter : method.getParameters()) {
            if (parameter.name() != null) {
                parameters.add(map.get(parameter.name()));
            } else {
                parameters.add(new ObjectMapper().readValue(json, parameter.type()));
            }
        }

        Object result = method.execute(parameters.toArray());

        return new ObjectMapper().writeValueAsString(result);
    }

    private static <T extends Annotation> Optional<MethodWrapper> findMethodFromObject(
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
