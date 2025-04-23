package sistema.veterinaria.backend.domain.port;

import sistema.veterinaria.backend.domain.model.Breed;
import sistema.veterinaria.backend.domain.model.Shifts;

import java.util.List;

public interface IShiftsRepository {

    Shifts save(Shifts shifts);
    Shifts update(Integer id, Shifts shifts);
    Iterable<Shifts> findAll();
    Shifts findById(Integer id);
    void deleteById(Integer id);

    void deleteAllByIdIn(List<Integer> ids) ;

}
