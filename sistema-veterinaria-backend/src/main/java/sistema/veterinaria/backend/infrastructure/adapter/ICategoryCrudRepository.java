package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.data.repository.CrudRepository;
import sistema.veterinaria.backend.infrastructure.Entity.CategoryEntity;

import java.util.List;

public interface ICategoryCrudRepository extends CrudRepository<CategoryEntity,Integer> {

    void deleteAllByIdIn(List<Integer> ids);

}
