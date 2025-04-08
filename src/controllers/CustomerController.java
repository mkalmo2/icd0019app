package controllers;

import junit.sales.SalesRecord;
import junit.sales.SalesRecordResult;
import junit.sales.TopSalesFinder;
import poly.customer.*;
import server.annotations.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Controller
public class CustomerController {

    public record CustomerRow(String id, String type, String name, Integer points) {}

    private final CustomerRepository repo = new CustomerRepository();

    private final BonusCollector collector = new BonusCollector(repo);

    @FunctionalInterface
    private interface CustomerCreator {
        AbstractCustomer create(String id, String name, int bonusPoints);
    }

    private record Entry(String type, String label, Class<?> aClass,
                        CustomerCreator creator) {}

    List<Entry> mappings = List.of(
        new Entry("regular", "Regular", RegularCustomer.class,
                (id, name, points) -> new RegularCustomer(id, name, points, LocalDate.now())),
        new Entry("gold", "Gold", GoldCustomer.class, GoldCustomer::new)
    );


    @Post("customers")
    public CustomerRow add(CustomerRow info) {
        AbstractCustomer customer = createCustomer(info.type, info.name, info.points);

        repo.save(customer);

        return toRow(customer);
    }

    @Delete("customers")
    public void deleteCustomer(@Param("id") String id) {
        repo.remove(id);
    }

    @Get("customers/types")
    public List<String[]> getTypeList() {
        return mappings.stream()
                .map(entry -> new String[]{entry.type, entry.label})
                .toList();
    }

    @Get("customers")
    public Object getAllPaged(@Param("pageNo") Integer pageNo,
                              @Param("pageSize") Integer pageSize) {

        record Result(List<CustomerRow> pageRows, int totalRowCount) {}

        List<CustomerRow> rows = repo.getAllPaged(pageNo, pageSize).stream()
                .map(this::toRow).toList();

        return new Result(rows, repo.getCustomerCount());
    }

    @Post("customers/collect-bonus")
    public CustomerRow collectBonus(@Param("customerId") String customerId,
                                    @Param("orderAmount") Integer orderAmount,
                                    @Param("lastOrderDate") String dateAsString) {

        LocalDate date = LocalDate.parse(dateAsString);

        collector.gatherCustomerBonus(customerId, new Order(orderAmount, date));

        return toRow(repo.getCustomerById(customerId).orElseThrow());
    }

    private AbstractCustomer createCustomer(String type, String name, Integer points) {
        String id = UUID.randomUUID().toString();

        return mappings.stream()
                .filter(e -> e.type.equals(type))
                .findFirst()
                .flatMap(e -> Optional.of(e.creator.create(id, name, points)))
                .orElseThrow(() -> new IllegalArgumentException("unknown type: " + type));
    }

    private CustomerRow toRow(AbstractCustomer customer) {
        String type = mappings.stream()
                .filter(e -> e.aClass.equals(customer.getClass()))
                .map(e -> e.type)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "unknown class: " + customer.getClass()));

        return new CustomerRow(customer.getId(), type,
                customer.getName(), customer.getBonusPoints());
    }

}
