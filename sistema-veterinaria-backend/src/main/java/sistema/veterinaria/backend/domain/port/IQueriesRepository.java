package sistema.veterinaria.backend.domain.port;

import sistema.veterinaria.backend.domain.model.Breed;
import sistema.veterinaria.backend.domain.model.Queries;

import java.util.List;

public interface IQueriesRepository {

    Queries save( Queries queries);
    Queries update(Integer id, Queries queries);
    Iterable< Queries> findAll();
    Queries findById(Integer id);
    void deleteById(Integer id);

    void deleteAllByIdIn(List<Integer> ids) ;
}
