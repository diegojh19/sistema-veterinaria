package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.data.repository.CrudRepository;
import sistema.veterinaria.backend.infrastructure.Entity.RecipesEntity;

import java.util.List;

public interface IRecipesCrudRepository extends CrudRepository<RecipesEntity, Integer> {

    void deleteAllByIdIn(List<Integer> ids);

}

