package server;

import server.annotations.Param;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.Arrays;
import java.util.List;

public class MethodWrapper {

    public Method method;
    private final Object controller;
//    private final List<Object> parameters = new ArrayList<>();

    public MethodWrapper(Object controller, Method method) {
        this.method = method;
        this.controller = controller;
//        this.parameters.addAll(parameters);
    }

    public List<ParameterWrapper> getParameters() {
        return Arrays.stream(method.getParameters())
                .map(this::wrapParameter).toList();
    }

    private ParameterWrapper wrapParameter(Parameter parameter) {

        for (Annotation annotation : parameter.getAnnotations()) {
            if (annotation instanceof Param paramAnnotation) {
                return new ParameterWrapper(parameter.getType(),
                        paramAnnotation.value());
            }
        }
        return new ParameterWrapper(parameter.getType(), null);
    }

    public Object execute(Object ... parameters) {
//        this.parameters.addAll(Arrays.asList(parameters));

        try {
            return method.invoke(controller, parameters);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
