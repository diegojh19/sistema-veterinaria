package sistema.veterinaria.backend.domain.port;

import sistema.veterinaria.backend.domain.model.Breed;

import java.util.List;

public interface IBreedRepository {

    Breed save(Breed breed);
    Breed update(Integer id, Breed breed);

    Iterable<Breed> findAll();
    Breed findById(Integer id);
    void deleteById(Integer id);
    void deleteAllByIdIn(List<Integer> ids) ;
}
