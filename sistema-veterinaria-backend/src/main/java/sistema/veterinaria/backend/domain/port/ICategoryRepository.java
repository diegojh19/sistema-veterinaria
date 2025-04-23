package sistema.veterinaria.backend.domain.port;

import sistema.veterinaria.backend.domain.model.Category;

import java.util.List;

public interface ICategoryRepository {

    Category save(Category category);
    Category update(Integer id, Category category);
    Iterable<Category> findAll();
    Category findById(Integer id);
    void deleteById(Integer  id);

    void deleteAllByIdIn(List<Integer> ids) ;
}
