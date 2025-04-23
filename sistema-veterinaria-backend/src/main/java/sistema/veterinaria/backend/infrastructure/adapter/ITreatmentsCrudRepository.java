package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.data.repository.CrudRepository;
import sistema.veterinaria.backend.infrastructure.Entity.TreatmentsEntity;

import java.util.List;

public interface ITreatmentsCrudRepository extends CrudRepository<TreatmentsEntity, Integer> {

    void deleteAllByIdIn(List<Integer> ids);

}
