package server;

import server.annotations.Controller;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Optional;

public class PackageScanner {

    private final String packageName;

    public PackageScanner(String packageName) {
        this.packageName = packageName;
    }

    public List<Object> findControllers() {
        try {
            return findControllersSub();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Object> findControllersSub() throws IOException {
        final List<Object> controllers = new ArrayList<>();

        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        String path = packageName.replace('.', '/');
        Enumeration<URL> resources = classLoader.getResources(path);

        while (resources.hasMoreElements()) {
            URL resource = resources.nextElement();
            File directory = new File(resource.getFile());

            for (File file : readDirectory(directory)) {
                loadControllerClass(file).ifPresent(clazz -> {
                    controllers.add(createObject(clazz));
                });
            }
        }


        return controllers;
    }

    private static File[] readDirectory(File directory) {
        File[] files = directory.listFiles();

        return files != null ? files : new File[0];
    }

    private static Object createObject(Class<?> clazz) {
        try {
            return clazz.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            throw new RuntimeException("Failed to instantiate controller: " + clazz);
        }
    }

    private Optional<Class<?>> loadControllerClass(File file) {
        Optional<Class<?>> optional = loadClass(file);

        if (optional.isPresent() && optional.get().isAnnotationPresent(Controller.class)) {
            return optional;
        } else {
            return Optional.empty();
        }
    }

    private Optional<Class<?>> loadClass(File file) {
        if (!file.getName().endsWith(".class")) {
            return Optional.empty();
        }

        String className = file.getName().replace(".class", "");

        try {
            return Optional.of(Class.forName(packageName + "." + className));
        } catch (ClassNotFoundException e) {
            return Optional.empty();
        }
    }

}