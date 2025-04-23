package sistema.veterinaria.backend.domain.port;

import sistema.veterinaria.backend.domain.model.Recipes;

import java.util.List;

public interface IRecipesRepository {

    Recipes save(Recipes recipes);
    Recipes update(Recipes recipes);
    Iterable<Recipes> findAll();
    Recipes findById(Integer id);
    void deleteById(Integer id);

    void deleteAllByIdIn(List<Integer> ids) ;
}
