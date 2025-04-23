package sistema.veterinaria.backend.infrastructure.rest;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sistema.veterinaria.backend.application.PatientsService;
import sistema.veterinaria.backend.domain.model.Customer;
import sistema.veterinaria.backend.domain.model.Patients;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/patients")
@CrossOrigin(origins = "http://localhost:4200")
public class PatientsController {

    @Autowired
    private final PatientsService patientsService;

    public PatientsController(PatientsService patientsService) {
        this.patientsService = patientsService;
    }

    @PostMapping
    public ResponseEntity<Patients> save(
            @RequestParam("name_patients") String name_patients,
            @RequestParam("photo_patients") String photo_patients,
            @RequestParam("birthdate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date birthdate,
            @RequestParam("age") String age,
            @RequestParam("sex") String sex,
            @RequestParam("color") String color,
            @RequestParam("fur") String fur,
            @RequestParam("allergy") String allergy,
            @RequestParam("breeds_idbreeds") Integer breeds_idbreeds,
            @RequestParam("customer_idcustomer") Integer customer_idcustomer,
            @RequestParam(value = "image", required = false) MultipartFile multipartFile
            ) throws IOException {

            Patients patients  = new Patients();

            patients.setName_patients(name_patients);
            patients.setPhoto_patients(photo_patients);
            patients.setBirthdate(birthdate);
            patients.setAge(age);
            patients.setSex(sex);
            patients.setColor(color);
            patients.setFur(fur);
            patients.setAllergy(allergy);
            patients.setBreeds_idbreeds(breeds_idbreeds);
            patients.setCustomer_idcustomer(customer_idcustomer);

            return new ResponseEntity<>(patientsService.save(patients,multipartFile), HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<Iterable<Patients>> findAll(){
        return ResponseEntity.ok(patientsService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patients> findById(@PathVariable Integer id){
        return ResponseEntity.ok(patientsService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id){
        patientsService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patients> update(
            @PathVariable Integer id,
            @RequestParam("name_patients") String name_patients,
            @RequestParam("photo_patients") String photo_patients,
            @RequestParam("birthdate") @DateTimeFormat(pattern = "yyyy-MM-dd") Date birthdate,
            @RequestParam("age") String age,
            @RequestParam("sex") String sex,
            @RequestParam("color") String color,
            @RequestParam("fur") String fur,
            @RequestParam("allergy") String allergy,
            @RequestParam("breeds_idbreeds") Integer breeds_idbreeds,
            @RequestParam("customer_idcustomer") Integer customer_idcustomer,
            @RequestParam(value = "image", required = false) MultipartFile multipartFile ) throws IOException {

        // Buscar el cliente existente
        Patients existingPatients = patientsService.findById(id);
        if (existingPatients == null) {
            throw new ResourceNotFoundException("Paciente no encontrado con ID: " + id);
        }

        existingPatients.setName_patients(name_patients);
        existingPatients.setPhoto_patients(photo_patients);
        existingPatients.setBirthdate(birthdate);
        existingPatients.setAge(age);
        existingPatients.setSex(sex);
        existingPatients.setColor(color);
        existingPatients.setFur(fur);
        existingPatients.setAllergy(allergy);
        existingPatients.setBreeds_idbreeds(breeds_idbreeds);
        existingPatients.setCustomer_idcustomer(customer_idcustomer);


        // Guardar los cambios utilizando el servicio
        Patients updatedPatients = patientsService.save(existingPatients, multipartFile);

        // Retornar el cliente actualizado
        return new ResponseEntity<>(updatedPatients, HttpStatus.OK);
    }

    @PostMapping("/delete-multiple")
    public ResponseEntity<Map<String, String>> deleteMultiplepatients(@RequestBody List<Integer> ids) {
        try {
            patientsService.deleteMultiplesPatients(ids);
            Map<String, String> response = new HashMap<>();
            response.put("message", "pacientes eliminados correctamente.");
            return ResponseEntity.ok(response);
        } catch (DataAccessException e) {
            // Manejo de errores relacionados con la base de datos
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error en la base de datos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            // Captura errores generales
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error al eliminar los pacientes: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }


}
