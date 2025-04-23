package sistema.veterinaria.backend.infrastructure.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema.veterinaria.backend.application.ShiftsService;
import sistema.veterinaria.backend.domain.model.Queries;
import sistema.veterinaria.backend.domain.model.Shifts;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/shifts")
@CrossOrigin(origins = "http://localhost:4200")
public class ShiftsController {

    @Autowired
    private final ShiftsService shiftsService;

    public ShiftsController(ShiftsService shiftsService) {
        this.shiftsService = shiftsService;
    }

    @PostMapping
    public ResponseEntity<Shifts> save(@RequestBody Shifts shifts) {
        return new ResponseEntity<>(shiftsService.save(shifts), HttpStatus.CREATED);

    }

    @GetMapping
    public ResponseEntity<Iterable<Shifts>> findAll() {
        return ResponseEntity.ok(shiftsService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shifts> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(shiftsService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id) {
        shiftsService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shifts> updateShifts(@PathVariable Integer id, @RequestBody Shifts shifts) {
        Shifts updateShifts = shiftsService.findById(id);

        if (shifts.getStart() != null) {
            updateShifts.setStart(shifts.getStart());
        }
        if (shifts.getEnd() != null) {
            updateShifts.setEnd(shifts.getEnd());
        }
        if (shifts.getTitle() != null) {
            updateShifts.setTitle(shifts.getTitle());
        }
        if (shifts.getCustomer_idcustomer() != null) {
            updateShifts.setCustomer_idcustomer(shifts.getCustomer_idcustomer());
        }

        shiftsService.save(updateShifts);

        return ResponseEntity.ok(updateShifts);

    }

    @PostMapping("/delete-multiple")
    public ResponseEntity<Map<String, String>> deleteMultipleShifts(@RequestBody List<Integer> ids) {
        try {
            shiftsService.deleteMultiplesShifts(ids);
            Map<String, String> response = new HashMap<>();
            response.put("message", "turnos eliminados correctamente.");
            return ResponseEntity.ok(response);
        } catch (DataAccessException e) {
            // Manejo de errores relacionados con la base de datos
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error en la base de datos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            // Captura errores generales
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error al eliminar los turnos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}