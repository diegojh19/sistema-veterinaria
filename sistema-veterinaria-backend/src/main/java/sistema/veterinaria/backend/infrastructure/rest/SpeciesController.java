package sistema.veterinaria.backend.infrastructure.rest;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema.veterinaria.backend.application.SpeciesService;
import sistema.veterinaria.backend.domain.model.Species;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/species")
@CrossOrigin(origins = "http://localhost:4200")
public class SpeciesController {
    @Autowired
    private final SpeciesService speciesService;

    public SpeciesController(SpeciesService speciesService) {
        this.speciesService = speciesService;
    }

    @PostMapping
    public ResponseEntity<Species> save(@RequestBody Species species){
        return new ResponseEntity<>(speciesService.save(species), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Iterable<Species>> findAll(){
        return ResponseEntity.ok(speciesService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Species> findById(@PathVariable Integer id){
        return ResponseEntity.ok(speciesService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id){
        speciesService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Species> updateSpecies(@PathVariable Integer id, @RequestBody Species species) {
        try {
            // Actualizar la especie
            Species updatedSpecies = speciesService.findById(id);

            if (species.getName_species()!= null){
                updatedSpecies.setName_species(species.getName_species());
            }

            speciesService.save(updatedSpecies);
            return ResponseEntity.ok(updatedSpecies); // Retornar especie actualizada con 200 OK
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 Internal Server Error
        }
    }

    @PostMapping("/delete-multiple")
    public ResponseEntity<Map<String, String>> deleteMultipleSpecies(@RequestBody List<Integer> ids) {
        try {
            speciesService.deleteMultiplesSpecies(ids);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Especies eliminadas correctamente.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error al eliminar las especies.");
            return ResponseEntity.status(500).body(response);
        }
    }


}
