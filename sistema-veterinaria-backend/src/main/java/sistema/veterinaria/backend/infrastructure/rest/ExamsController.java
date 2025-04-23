package sistema.veterinaria.backend.infrastructure.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema.veterinaria.backend.application.ExamsService;
import sistema.veterinaria.backend.domain.model.Diagnosis;
import sistema.veterinaria.backend.domain.model.Exams;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/exams")
@CrossOrigin(origins = "http://localhost:4200")
public class ExamsController {

    @Autowired
    private final ExamsService examsService;

    public ExamsController(ExamsService examsService) {
        this.examsService = examsService;
    }

    @PostMapping
    public ResponseEntity<Exams> save(@RequestBody Exams exams){
        return new ResponseEntity<>(examsService.save(exams), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Iterable<Exams>> findAll(){
        return ResponseEntity.ok(examsService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exams> findById(@PathVariable Integer id){
        return ResponseEntity.ok(examsService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id){
        examsService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exams> updateDiagnosis(@PathVariable Integer id, @RequestBody Exams exams) {
        Exams updateExams = examsService.findById(id);

        // Actualizar solo los campos no nulos
        if (exams.getMucous_membrane() != null) {
            updateExams.setMucous_membrane(exams.getMucous_membrane());
        }

        if (exams.getFur()!= null) {
            updateExams.setFur(exams.getFur());
        }

        if (exams.getOral()!= null) {
            updateExams.setOral(exams.getOral());
        }

        if (exams.getReproductive_system()!= null) {
            updateExams.setReproductive_system(exams.getReproductive_system());
        }

        if (exams.getRectal()!= null) {
            updateExams.setRectal(exams.getRectal());
        }

        if (exams.getEyes()!= null) {
            updateExams.setEyes(exams.getEyes());
        }

        if (exams.getLymph_modules()!= null) {
            updateExams.setLymph_modules(exams.getLymph_modules());
        }

        if (exams.getLocomotion()!= null) {
            updateExams.setLocomotion(exams.getLocomotion());
        }

        if (exams.getCardiovascular_system()!= null) {
            updateExams.setCardiovascular_system(exams.getCardiovascular_system());
        }

        if (exams.getRespiratory_system()!= null) {
            updateExams.setRespiratory_system(exams.getRespiratory_system());
        }

        if (exams.getDigestive_system()!= null) {
            updateExams.setDigestive_system(exams.getDigestive_system());
        }

        if (exams.getUrinary_system()!= null) {
            updateExams.setUrinary_system(exams.getUrinary_system());
        }

        if (exams.getQueries_idqueries() != null) {
            updateExams.setQueries_idqueries(exams.getQueries_idqueries());
        }

        examsService.save(updateExams);

        return ResponseEntity.ok(updateExams);

    }

    @PostMapping("/delete-multiple")
    public ResponseEntity<Map<String, String>> deleteMultiplebExams(@RequestBody List<Integer> ids) {
        try {
           examsService.deleteMultiplesExams(ids);
            Map<String, String> response = new HashMap<>();
            response.put("message", "examenes eliminados correctamente.");
            return ResponseEntity.ok(response);
        } catch (DataAccessException e) {
            // Manejo de errores relacionados con la base de datos
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error en la base de datos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            // Captura errores generales
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error al eliminar los examenes: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


}
