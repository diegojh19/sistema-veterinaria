package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import sistema.veterinaria.backend.domain.model.Customer;
import sistema.veterinaria.backend.domain.port.ICustomerRepository;
import sistema.veterinaria.backend.infrastructure.mapper.CustomerMapper;

import java.util.List;

@Repository
public class CustomerRepositoryImpl implements ICustomerRepository{

    @Autowired
    private final ICustomerCrudRepository iCustomerCrudRepository;

    @Autowired
    private final CustomerMapper customerMapper;

    public CustomerRepositoryImpl(ICustomerCrudRepository iCustomerCrudRepository, CustomerMapper customerMapper) {
        this.iCustomerCrudRepository = iCustomerCrudRepository;
        this.customerMapper = customerMapper;
    }

    @Override
    public Customer save(Customer customer) {
        return customerMapper.toCustomer(iCustomerCrudRepository.save(customerMapper.toCustomerEntity(customer)));
    }

    @Override
    public Customer update(Integer id, Customer customer) {
        iCustomerCrudRepository.findById(id).orElseThrow(
                ()->new RuntimeException("Customer no encontrada con id: " + id)
        );
        customer.setId(id);

        return customerMapper.toCustomer(iCustomerCrudRepository.save(customerMapper.toCustomerEntity(customer)));
    }

    @Override
    public Iterable<Customer> findAll() {
        return customerMapper.toCustomerList(iCustomerCrudRepository.findAll());
    }

    @Override
    public Customer findById(Integer id) {
        return customerMapper.toCustomer(iCustomerCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("customer con id "+id+ " no existe")
        ));
    }

    @Override
    public void deleteById(Integer id) {
        iCustomerCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("customer con id"+id+ " no existe")
        );
        iCustomerCrudRepository.deleteById(id);
    }

    @Override
    public void deleteAllByIdIn(List<Integer> ids) {

        if (ids != null && !ids.isEmpty()) {
            // Asegúrate de que el repositorio esté correctamente configurado para eliminar múltiples registros
            iCustomerCrudRepository.deleteAllByIdIn(ids);
        } else {
            throw new IllegalArgumentException("La lista de IDs no puede estar vacía.");
        }

    }


}
