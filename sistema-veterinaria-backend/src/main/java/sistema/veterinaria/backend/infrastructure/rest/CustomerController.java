package sistema.veterinaria.backend.infrastructure.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sistema.veterinaria.backend.application.CustomerService;
import sistema.veterinaria.backend.domain.model.Category;
import sistema.veterinaria.backend.domain.model.Customer;
import org.apache.velocity.exception.ResourceNotFoundException;
import sistema.veterinaria.backend.domain.model.Patients;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/v1/admin/customers")
@CrossOrigin(origins = "http://localhost:4200")

public class CustomerController {

    @Autowired
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<Customer> save(

                                         @RequestParam("name_customer") String name_customer,
                                         @RequestParam("surname_customer") String surname_customer,
                                         @RequestParam("photo_customer") String photo_customer,
                                         @RequestParam("citizenship_card") String citizenship_card,
                                         @RequestParam("cellphone_customer") String cellphone_customer,
                                         @RequestParam("address") String address,
                                         @RequestParam("city") String city,
                                         @RequestParam("email_customer") String email_customer,
                                         @RequestParam(value = "image", required = false)MultipartFile multipartFile
                                         ) throws IOException {

        Customer customer = new Customer();

        customer.setName_customer(name_customer);
        customer.setSurname_customer(surname_customer);
        customer.setPhoto_customer(photo_customer);
        customer.setCitizenship_card(citizenship_card);
        customer.setCellphone_customer(cellphone_customer);
        customer.setAddress(address);
        customer.setCity(city);
        customer.setEmail_customer(email_customer);

        return new ResponseEntity<>(customerService.save(customer,multipartFile), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Iterable<Customer>> findAll(){
        return ResponseEntity.ok(customerService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> findById(@PathVariable Integer id){
        return ResponseEntity.ok(customerService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id){
        customerService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> update(
            @PathVariable Integer id,
            @RequestParam("name_customer") String name_customer,
            @RequestParam("surname_customer") String surname_customer,
            @RequestParam("citizenship_card") String citizenship_card,
            @RequestParam("cellphone_customer") String cellphone_customer,
            @RequestParam("address") String address,
            @RequestParam("city") String city,
            @RequestParam("email_customer") String email_customer,
            @RequestParam(value = "image", required = false) MultipartFile multipartFile) throws IOException {

        // Buscar el cliente existente
        Customer existingCustomer = customerService.findById(id);
        if (existingCustomer == null) {
            throw new ResourceNotFoundException("Cliente no encontrado con ID: " + id);
        }

        // Actualizar los campos del cliente
        existingCustomer.setName_customer(name_customer);
        existingCustomer.setSurname_customer(surname_customer);

        existingCustomer.setCitizenship_card(citizenship_card);
        existingCustomer.setCellphone_customer(cellphone_customer);
        existingCustomer.setAddress(address);
        existingCustomer.setCity(city);
        existingCustomer.setEmail_customer(email_customer);

        // Guardar los cambios utilizando el servicio
        Customer updatedCustomer = customerService.save(existingCustomer, multipartFile);

        // Retornar el cliente actualizado
        return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
    }

    @PostMapping("/delete-multiple")
    public ResponseEntity<Map<String, String>> deleteMultiplecustomers(@RequestBody List<Integer> ids) {
        try {
            customerService.deleteMultiplesCustomers(ids);
            Map<String, String> response = new HashMap<>();
            response.put("message", "clientes eliminados correctamente.");
            return ResponseEntity.ok(response);
        } catch (DataAccessException e) {
            // Manejo de errores relacionados con la base de datos
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error en la base de datos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            // Captura errores generales
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error al eliminar los clientes: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
