package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.data.repository.CrudRepository;
import sistema.veterinaria.backend.infrastructure.Entity.DiagnosisEntity;

import java.util.List;

public interface IDiagnosisCrudRepository extends CrudRepository<DiagnosisEntity, Integer> {
    void deleteAllByIdIn(List<Integer> ids);

}
