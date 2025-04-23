package sistema.veterinaria.backend.infrastructure.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema.veterinaria.backend.application.CategoryService;
import sistema.veterinaria.backend.domain.model.Category;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/categories")
@CrossOrigin(origins = "http://localhost:4200")

public class CategoryController {

    @Autowired
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<Category> save(@RequestBody Category category){
        return new ResponseEntity<>(categoryService.save(category), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Iterable<Category>> findAll(){
        return ResponseEntity.ok(categoryService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> findById(@PathVariable Integer id){
        return ResponseEntity.ok(categoryService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id){
        categoryService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Integer id, @RequestBody Category category) {
        Category updateCategory = categoryService.findById(id);

        // Actualizar solo los campos no nulos
        if (category.getName_category() != null) {
            updateCategory.setName_category(category.getName_category());
        }

        // Guardar los cambios en la base de datos
        categoryService.save(updateCategory);

        return ResponseEntity.ok(updateCategory);
    }

    @PostMapping("/delete-multiple")
    public ResponseEntity<Map<String, String>> deleteMultipleCategories(@RequestBody List<Integer> ids) {
        try {
            categoryService.deleteMultiplesCategories(ids);
            Map<String, String> response = new HashMap<>();
            response.put("message", "categorias eliminadas correctamente.");
            return ResponseEntity.ok(response);
        } catch (DataAccessException e) {
            // Manejo de errores relacionados con la base de datos
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error en la base de datos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            // Captura errores generales
            Map<String, String> response = new HashMap<>();
            response.put("message", "Errorr al eliminar las categorias: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
