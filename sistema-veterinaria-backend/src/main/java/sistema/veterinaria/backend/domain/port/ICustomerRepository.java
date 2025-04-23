package sistema.veterinaria.backend.domain.port;

import sistema.veterinaria.backend.domain.model.Customer;

import java.util.List;

public interface ICustomerRepository {

    Customer save(Customer customer);
    Customer update(Integer id, Customer customer);
    Iterable<Customer> findAll();
    Customer findById(Integer id);
    void deleteById(Integer  id);

    void deleteAllByIdIn(List<Integer> ids) ;
}
