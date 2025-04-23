package sistema.veterinaria.backend.infrastructure.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema.veterinaria.backend.application.QueriesService;
import sistema.veterinaria.backend.domain.model.Queries;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/queries")
@CrossOrigin(origins = "http://localhost:4200")
public class QueriesController {
    @Autowired
    private final QueriesService queriesService;

    public QueriesController(QueriesService queriesService) {
        this.queriesService = queriesService;
    }

    @PostMapping
    public ResponseEntity<Queries> save(@RequestBody Queries queries){
        return new ResponseEntity<>(queriesService.save(queries), HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<Iterable<Queries>> findAll(){
        return ResponseEntity.ok(queriesService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Queries> findById(@PathVariable Integer id){
        return ResponseEntity.ok(queriesService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id){
        queriesService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Queries> updateQueries(@PathVariable Integer id, @RequestBody Queries queries) {
        Queries updateQueries = queriesService.findById(id);

        if (queries.getConsultation_date() != null) {
            updateQueries.setConsultation_date(queries.getConsultation_date());
        }

        if (queries.getReason() != null) {
            updateQueries.setReason(queries.getReason());
        }

        if (queries.getPast() != null) {
            updateQueries.setPast(queries.getPast());
        }

        if (queries.getDiseases() != null) {
            updateQueries.setDiseases(queries.getDiseases());
        }

        if (queries.getNext_consultation() != null) {
            updateQueries.setNext_consultation(queries.getNext_consultation());
        }
        if (queries.getPatients_idpatients() != null) {
            updateQueries.setPatients_idpatients(queries.getPatients_idpatients());
        }

        queriesService.save(updateQueries);

        return ResponseEntity.ok(updateQueries);

       }

    @PostMapping("/delete-multiple")
    public ResponseEntity<Map<String, String>> deleteMultipleQueries(@RequestBody List<Integer> ids) {
        try {
            queriesService.deleteMultiplesQueries(ids);
            Map<String, String> response = new HashMap<>();
            response.put("message", "consultas eliminadas correctamente.");
            return ResponseEntity.ok(response);
        } catch (DataAccessException e) {
            // Manejo de errores relacionados con la base de datos
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error en la base de datos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            // Captura errores generales
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error al eliminar las consultas: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

}
