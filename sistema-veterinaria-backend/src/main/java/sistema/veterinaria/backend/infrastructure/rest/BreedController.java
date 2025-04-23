package sistema.veterinaria.backend.infrastructure.rest;

import jakarta.validation.Valid;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema.veterinaria.backend.application.BreedService;
import sistema.veterinaria.backend.domain.model.Breed;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/breeds")
@CrossOrigin(origins = "http://localhost:4200")
public class BreedController {

    @Autowired
    private final BreedService breedService;

    public BreedController(BreedService breedService) {
        this.breedService = breedService;
    }

    @PostMapping
    public ResponseEntity<Breed> save(@RequestBody @Valid Breed breed){
        return new ResponseEntity<>(breedService.save(breed), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Iterable<Breed>> findAll(){
        return ResponseEntity.ok(breedService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Breed> findById(@PathVariable Integer id){
        return ResponseEntity.ok(breedService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id){
        breedService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Breed> updateBreed(@PathVariable Integer id, @RequestBody Breed breed) {
        try {

            // Actualizar la raza
            Breed updatedBreed = breedService.findById(id);

            if(breed.getName_breeds()!= null){
                updatedBreed.setName_breeds(breed.getName_breeds());
            }
            if(breed.getSpeciesId()!= null){
                updatedBreed.setSpeciesId(breed.getSpeciesId());
            }

            breedService.save(updatedBreed);

            return ResponseEntity.ok(updatedBreed); // Retornar raza actualizada con 200 OK

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 Internal Server Error
        }
    }

    @PostMapping("/delete-multiple")
    public ResponseEntity<Map<String, String>> deleteMultiplebreeds(@RequestBody List<Integer> ids) {
        try {
            breedService.deleteMultiplesBreeds(ids);
            Map<String, String> response = new HashMap<>();
            response.put("message", "razas eliminadas correctamente.");
            return ResponseEntity.ok(response);
        } catch (DataAccessException e) {
            // Manejo de errores relacionados con la base de datos
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error en la base de datos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            // Captura errores generales
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error al eliminar las razas: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


}
