package sistema.veterinaria.backend.domain.port;

import sistema.veterinaria.backend.domain.model.Species;

import java.util.List;

public interface ISpeciesRepository {

    Species save(Species species);
    Species update(Integer id, Species species);
    Iterable<Species> findAll();
    Species findById(Integer id);
    void deleteById(Integer id);
    void deleteAllByIdIn(List<Integer> ids) ;


}
