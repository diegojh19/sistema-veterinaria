package sistema.veterinaria.backend.infrastructure.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema.veterinaria.backend.application.DiagnosisService;
import sistema.veterinaria.backend.domain.model.Diagnosis;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/diagnosis")
@CrossOrigin(origins = "http://localhost:4200")

public class DiagnosisController {

    @Autowired
    private final DiagnosisService diagnosisService;

    public DiagnosisController(DiagnosisService diagnosisService) {
        this.diagnosisService = diagnosisService;
    }
    @PostMapping
    public ResponseEntity<Diagnosis> save(@RequestBody Diagnosis diagnosis){
        return new ResponseEntity<>(diagnosisService.save(diagnosis), HttpStatus.CREATED);

    }
    @GetMapping
    public ResponseEntity<Iterable<Diagnosis>> findAll(){
        return ResponseEntity.ok(diagnosisService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Diagnosis> findById(@PathVariable Integer id){
        return ResponseEntity.ok(diagnosisService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id){
        diagnosisService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Diagnosis> updateDiagnosis(@PathVariable Integer id, @RequestBody Diagnosis diagnosis) {
        Diagnosis updateDiagnosis = diagnosisService.findById(id);

        // Actualizar solo los campos no nulos
        if (diagnosis.getDetail_diagnosis() != null) {
            updateDiagnosis.setDetail_diagnosis(diagnosis.getDetail_diagnosis());
        }

        if (diagnosis.getDate_diagnosis() != null) {
            updateDiagnosis.setDate_diagnosis(diagnosis.getDate_diagnosis());
        }

        if (diagnosis.getQueries_idqueries() != null) {
            updateDiagnosis.setQueries_idqueries(diagnosis.getQueries_idqueries());
        }

        diagnosisService.save(updateDiagnosis);

        return ResponseEntity.ok(updateDiagnosis);

       }

    @PostMapping("/delete-multiple")
    public ResponseEntity<Map<String, String>> deleteMultipleDiagnosis(@RequestBody List<Integer> ids) {
        try {
            diagnosisService.deleteMultiplesDiagnosis(ids);
            Map<String, String> response = new HashMap<>();
            response.put("message", "diagnosticos eliminados correctamente.");
            return ResponseEntity.ok(response);
        } catch (DataAccessException e) {
            // Manejo de errores relacionados con la base de datos
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error en la base de datos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            // Captura errores generales
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error al eliminar los diagnosticos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    }
