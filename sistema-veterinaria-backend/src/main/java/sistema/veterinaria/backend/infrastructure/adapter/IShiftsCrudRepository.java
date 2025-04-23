package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.data.repository.CrudRepository;
import sistema.veterinaria.backend.infrastructure.Entity.ShiftsEntity;

import java.util.List;

public interface IShiftsCrudRepository extends CrudRepository<ShiftsEntity,Integer> {
    void deleteAllByIdIn(List<Integer> ids);

}
