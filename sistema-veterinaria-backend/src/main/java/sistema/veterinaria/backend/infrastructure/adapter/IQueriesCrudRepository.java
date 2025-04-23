package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.data.repository.CrudRepository;
import sistema.veterinaria.backend.infrastructure.Entity.QueriesEntity;

import java.util.List;

public interface IQueriesCrudRepository extends CrudRepository<QueriesEntity, Integer> {
    void deleteAllByIdIn(List<Integer> ids);

}
