package sistema.veterinaria.backend.infrastructure.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema.veterinaria.backend.application.TreatmentsService;
import sistema.veterinaria.backend.domain.model.Patients;
import sistema.veterinaria.backend.domain.model.Treatments;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/treatments")
@CrossOrigin(origins = "http://localhost:4200")
public class TreatmentsController {

    @Autowired
    private final TreatmentsService treatmentsService;

    public TreatmentsController(TreatmentsService treatmentsService) {
        this.treatmentsService = treatmentsService;
    }

    @PostMapping
    public ResponseEntity<Treatments> save(@RequestBody Treatments treatments){
        return new ResponseEntity<>(treatmentsService.save(treatments), HttpStatus.CREATED);

    }

    @GetMapping
    public ResponseEntity<Iterable<Treatments>> findAll(){
        return ResponseEntity.ok(treatmentsService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Treatments> findById(@PathVariable Integer id){
        return ResponseEntity.ok(treatmentsService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id){
        treatmentsService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Treatments> updateTreatments(@PathVariable Integer id, @RequestBody Treatments treatments){
        Treatments updateTreatments = treatmentsService.findById(id);
        if (treatments.getDetail_treatments()!=null){
            updateTreatments.setDetail_treatments(treatments.getDetail_treatments());
        }

        if (treatments.getDiagnosis_iddianosis()!=null){
            updateTreatments.setDiagnosis_iddianosis(treatments.getDiagnosis_iddianosis());
        }

        treatmentsService.save(updateTreatments);

        return ResponseEntity.ok(updateTreatments);
    }

    @PostMapping("/delete-multiple")
    public ResponseEntity<Map<String, String>> deleteMultipleTreatments(@RequestBody List<Integer> ids) {
        try {
            treatmentsService.deleteMultiplesTreatments(ids);
            Map<String, String> response = new HashMap<>();
            response.put("message", "tratamientos eliminados correctamente.");
            return ResponseEntity.ok(response);
        } catch (DataAccessException e) {
            // Manejo de errores relacionados con la base de datos
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error en la base de datos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            // Captura errores generales
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error al eliminar las tratamientos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

}




