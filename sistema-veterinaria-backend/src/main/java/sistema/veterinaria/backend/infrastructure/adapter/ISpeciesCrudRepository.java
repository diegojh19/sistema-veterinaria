package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.data.repository.CrudRepository;
import sistema.veterinaria.backend.infrastructure.Entity.SpeciesEntity;

import java.util.List;

public interface ISpeciesCrudRepository  extends CrudRepository<SpeciesEntity,Integer> {

    void deleteAllByIdIn(List<Integer> ids);
}
