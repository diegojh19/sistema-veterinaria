package sistema.veterinaria.backend.infrastructure.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema.veterinaria.backend.application.RecipesService;
import sistema.veterinaria.backend.domain.model.Queries;
import sistema.veterinaria.backend.domain.model.Recipes;
import sistema.veterinaria.backend.domain.port.IRecipesRepository;
import sistema.veterinaria.backend.infrastructure.Entity.RecipesEntity;
import sistema.veterinaria.backend.infrastructure.adapter.IRecipesCrudRepository;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/recipes")
@CrossOrigin(origins = "http://localhost:4200")

public class RecipesController {
    @Autowired
    private final RecipesService recipesService;

    private final IRecipesCrudRepository iRecipesCrudRepository;

    public RecipesController(RecipesService recipesService, IRecipesRepository iRecipesRepository, IRecipesCrudRepository iRecipesCrudRepository) {
        this.recipesService = recipesService;
        this.iRecipesCrudRepository = iRecipesCrudRepository;

    }

    @PostMapping
    public ResponseEntity<Recipes> save(@RequestBody Recipes recipes){
        return new ResponseEntity<>(recipesService.save(recipes), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Iterable<Recipes>> findAll(){
        return ResponseEntity.ok(recipesService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipes> findById(@PathVariable Integer id){
        return ResponseEntity.ok(recipesService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id){
        recipesService.deleteById(id);
        return ResponseEntity.ok().build();
    }


    @PutMapping("/{id}")
    public ResponseEntity<Recipes> updateRecipes(@PathVariable Integer id, @RequestBody Recipes recipes) {
        Recipes updateRecipes = recipesService.findById(id);

        if (recipes.getRecipe_date() != null) {
            updateRecipes.setRecipe_date(recipes.getRecipe_date());
        }

        if (recipes.getDescription() != null) {
            updateRecipes.setDescription(recipes.getDescription());
        }

        if (recipes.getIndications() != null) {
            updateRecipes.setIndications(recipes.getIndications());
        }

        if (recipes.getPatients_idpatients() != null) {
            updateRecipes.setPatients_idpatients(recipes.getPatients_idpatients());
        }

        recipesService.save(updateRecipes);

        return ResponseEntity.ok(updateRecipes);

    }

    @GetMapping("/{id}/pdf")


    public ResponseEntity<byte[]> downloadPdf(@PathVariable Integer id) throws IOException {
        // Buscar la receta por ID
        RecipesEntity recipes = iRecipesCrudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receta no encontrada"));

        // Generar el PDF
        byte[] pdfContents = recipesService.generatePdf(recipes);

        // Configurar la respuesta para enviar el archivo PDF
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receta-" + id + ".pdf")
                .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                .body(pdfContents);
    }

    @PostMapping("/delete-multiple")
    public ResponseEntity<Map<String, String>> deleteMultipleRecipes(@RequestBody List<Integer> ids) {
        try {
            recipesService.deleteMultiplesRecipes(ids);
            Map<String, String> response = new HashMap<>();
            response.put("message", "recetas eliminadas correctamente.");
            return ResponseEntity.ok(response);
        } catch (DataAccessException e) {
            // Manejo de errores relacionados con la base de datos
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error en la base de datos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            // Captura errores generales
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error al eliminar las recetas: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


}
