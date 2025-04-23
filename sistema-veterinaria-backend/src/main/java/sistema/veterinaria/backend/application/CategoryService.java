package sistema.veterinaria.backend.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import sistema.veterinaria.backend.domain.model.Category;
import sistema.veterinaria.backend.domain.port.ICategoryRepository;

import java.util.List;

public class CategoryService {
    @Autowired
    private final ICategoryRepository iCategoryRepository;

    public CategoryService(ICategoryRepository iCategoryRepository) {
        this.iCategoryRepository = iCategoryRepository;
    }

    public Category save(Category category){
        return iCategoryRepository.save(category);
    }

    public Category update(Integer id, Category category){
        return iCategoryRepository.save(category);
    }

    public Iterable<Category> findAll(){
        return iCategoryRepository.findAll();
    }

    public Category findById(Integer id){
        return iCategoryRepository.findById(id);
    }

    public void deleteById(Integer id){
        iCategoryRepository.deleteById(id);
    }

    public void deleteMultiplesCategories(List<Integer> ids) {
        try {
            for (Integer id : ids) {
                iCategoryRepository.deleteById(id);  // Verifica que el método deleteById no lance ninguna excepción
            }
        } catch (DataAccessException e) {
            // Loguear el error con detalles específicos para base de datos
            System.out.println("Error en la base de datos: " + e.getMessage());
            throw new RuntimeException("Error al eliminar las categorias");
        } catch (Exception e) {
            // Loguear cualquier otro tipo de excepción
            System.out.println("Error general: " + e.getMessage());
            throw new RuntimeException("Error al eliminar las categorias");
        }
    }
}
