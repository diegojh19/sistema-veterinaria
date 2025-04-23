package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.stereotype.Repository;
import sistema.veterinaria.backend.domain.model.Recipes;
import sistema.veterinaria.backend.domain.port.IRecipesRepository;
import sistema.veterinaria.backend.infrastructure.mapper.RecipesMapper;

import java.util.List;

@Repository
public class RecipesRepositoryImpl implements IRecipesRepository {

    private final IRecipesCrudRepository iRecipesCrudRepository;

    private final RecipesMapper recipesMapper;


    public RecipesRepositoryImpl(IRecipesCrudRepository iRecipesCrudRepository, RecipesMapper recipesMapper) {
        this.iRecipesCrudRepository = iRecipesCrudRepository;
        this.recipesMapper = recipesMapper;
    }

    @Override
    public Recipes save(Recipes recipes) {
        return recipesMapper.toRecipes(iRecipesCrudRepository.save(recipesMapper.toRecipesEntity(recipes)));
    }

    @Override
    public Recipes update(Recipes recipes) {
        return null;
    }

    @Override
    public Iterable<Recipes> findAll() {
        return recipesMapper.toRecipesList(iRecipesCrudRepository.findAll());
    }

    @Override
    public Recipes findById(Integer id) {
        return recipesMapper.toRecipes(iRecipesCrudRepository.findById(id).orElseThrow(
                () -> new RuntimeException("receta con id" + id + " no existe")
        ));
    }

    @Override
    public void deleteById(Integer id) {

        iRecipesCrudRepository.findById(id).orElseThrow(
                () -> new RuntimeException("receta con id" + id + " no existe")
        );
        iRecipesCrudRepository.deleteById(id);

    }

    @Override
    public void deleteAllByIdIn(List<Integer> ids) {

        if (ids != null && !ids.isEmpty()) {
            // Asegúrate de que el repositorio esté correctamente configurado para eliminar múltiples registros
            iRecipesCrudRepository.deleteAllByIdIn(ids);
        } else {
            throw new IllegalArgumentException("La lista de IDs no puede estar vacía.");
        }

    }
}
