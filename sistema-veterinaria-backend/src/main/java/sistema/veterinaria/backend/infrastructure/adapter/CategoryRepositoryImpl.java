package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import sistema.veterinaria.backend.domain.model.Category;
import sistema.veterinaria.backend.domain.port.ICategoryRepository;
import sistema.veterinaria.backend.infrastructure.mapper.CategoryMapper;

import java.util.List;

@Repository

public class CategoryRepositoryImpl implements ICategoryRepository {
    @Autowired
    private final ICategoryCrudRepository iCategoryCrudRepository;
    @Autowired
    private final CategoryMapper categoryMapper;

    public CategoryRepositoryImpl(ICategoryCrudRepository iCategoryCrudRepository, CategoryMapper categoryMapper) {
        this.iCategoryCrudRepository = iCategoryCrudRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public Category save(Category category) {
        return categoryMapper.toCategory(iCategoryCrudRepository.save(categoryMapper.toCategoryEntity(category)));
    }

    @Override
    public Category update(Integer id, Category category) {
        iCategoryCrudRepository.findById(id).orElseThrow(
                ()->new RuntimeException("Category no encontrada con id: " + id)
        );
        category.setId(id);
        return categoryMapper.toCategory(iCategoryCrudRepository.save(categoryMapper.toCategoryEntity(category)));
    }

    @Override
    public Iterable<Category> findAll() {
        return categoryMapper.toCategoryList(iCategoryCrudRepository.findAll());
    }

    @Override
    public Category findById(Integer id) {
        return categoryMapper.toCategory(iCategoryCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("categoria con id "+id+ " no existe")
        ));
    }

    @Override
    public void deleteById(Integer id) {
        iCategoryCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("categoria con id"+id+ " no existe")
        );
        iCategoryCrudRepository.deleteById(id);

    }

    @Override
    public void deleteAllByIdIn(List<Integer> ids) {

        if (ids != null && !ids.isEmpty()) {
            // Asegúrate de que el repositorio esté correctamente configurado para eliminar múltiples registros
            iCategoryCrudRepository.deleteAllByIdIn(ids);
        } else {
            throw new IllegalArgumentException("La lista de IDs no puede estar vacía.");
        }

    }
}
