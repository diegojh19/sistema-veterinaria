package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.data.repository.CrudRepository;
import sistema.veterinaria.backend.infrastructure.Entity.BreedEntity;

import java.util.List;

public interface IBreedCrudRepository extends CrudRepository<BreedEntity,Integer> {

    void deleteAllByIdIn(List<Integer> ids);
}
