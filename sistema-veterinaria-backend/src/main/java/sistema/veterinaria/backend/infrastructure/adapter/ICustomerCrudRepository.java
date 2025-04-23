package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.data.repository.CrudRepository;
import sistema.veterinaria.backend.infrastructure.Entity.CustomerEntity;
import sistema.veterinaria.backend.infrastructure.Entity.UserEntity;

import java.util.List;
import java.util.Optional;

public interface ICustomerCrudRepository extends CrudRepository<CustomerEntity, Integer> {
    void deleteAllByIdIn(List<Integer> ids);

}
