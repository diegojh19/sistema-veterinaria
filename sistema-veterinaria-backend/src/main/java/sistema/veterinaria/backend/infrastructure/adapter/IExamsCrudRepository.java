package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.data.repository.CrudRepository;
import sistema.veterinaria.backend.infrastructure.Entity.ExamsEntity;

import java.util.List;

public interface IExamsCrudRepository extends CrudRepository<ExamsEntity, Integer> {
    void deleteAllByIdIn(List<Integer> ids);

}
