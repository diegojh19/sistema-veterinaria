package sistema.veterinaria.backend.infrastructure.rest;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema.veterinaria.backend.application.UserService;
import sistema.veterinaria.backend.domain.model.Breed;
import sistema.veterinaria.backend.domain.model.User;
import sistema.veterinaria.backend.infrastructure.adapter.UserRepositoryImpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private final UserService userService;

    private final UserRepositoryImpl userRepository;


    public UserController(UserService userService, UserRepositoryImpl userRepository) {
        this.userService = userService;

        this.userRepository = userRepository;
    }

    @PostMapping
    public User save(@RequestBody User user){
        return userService.save(user);
    }

    @GetMapping("/{id}")
    public User findById(@PathVariable Integer id){
        return userService.findById(id);
    }

    @GetMapping
    public ResponseEntity<Iterable<User>> findAll(){
        return ResponseEntity.ok(userService.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id){
        userService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User user) {
        try {


            User updatedUser = userService.findById(id);

            if(user.getUsername()!= null){
                updatedUser.setUsername(user.getUsername());
            }

            if(user.getFirstName()!= null){
                updatedUser.setFirstName(user.getFirstName());
            }

            if(user.getLastName()!= null){
                updatedUser.setLastName(user.getLastName());
            }

            if(user.getEmail()!= null){
                updatedUser.setEmail(user.getEmail());
            }

            if(user.getAddress()!= null){
                updatedUser.setAddress(user.getAddress());
            }
            if(user.getCellphone()!= null){
                updatedUser.setCellphone(user.getCellphone());
            }
            if(user.getPassword()!= null){
                updatedUser.setPassword(user.getPassword());
            }



           userService.save(updatedUser);

            return ResponseEntity.ok(updatedUser);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 Internal Server Error
        }
    }

    @PostMapping("/delete-multiple")
    public ResponseEntity<Map<String, String>> deleteMultipleusers(@RequestBody List<Integer> ids) {
        try {
            userService.deleteMultiplesUsers(ids);
            Map<String, String> response = new HashMap<>();
            response.put("message", "usuarios eliminados correctamente.");
            return ResponseEntity.ok(response);
        } catch (DataAccessException e) {
            // Manejo de errores relacionados con la base de datos
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error en la base de datos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        } catch (Exception e) {
            // Captura errores generales
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error al eliminar los usuarios: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/users/email/{email}")
    public User finByEmail(@PathVariable String email) {
        return userService.finByEmail(email);
    }

    // Endpoint para verificar el correo del usuario
    @GetMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestParam("token") String token) {
        boolean success = userRepository.verificarUsuario(token);
        if (success) {
            return ResponseEntity.ok().body(new ResponseMessage("Correo verificado con éxito."));
        } else {
            return ResponseEntity.badRequest().body(new ResponseMessage("El token ha expirado o es inválido."));
        }
    }

    // Clase auxiliar para la respuesta
    public class ResponseMessage {
        private String message;

        public ResponseMessage(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }


}
