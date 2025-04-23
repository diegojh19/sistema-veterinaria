package sistema.veterinaria.backend.infrastructure.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import sistema.veterinaria.backend.application.RegistrationService;
import sistema.veterinaria.backend.domain.model.User;

@RestController
@RequestMapping("/api/v1/security")
@CrossOrigin(origins = "http://localhost:4200")
public class RegistrationController {

    private final RegistrationService registrationService;

    private final BCryptPasswordEncoder passwordEncoder;

    public RegistrationController(RegistrationService registrationService, BCryptPasswordEncoder passwordEncoder) {
        this.registrationService = registrationService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        //Mensaje mensaje = new Mensaje("Email already exists");

        if (registrationService.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists.");
         //    return new ResponseEntity<>(mensaje, HttpStatus.UNAUTHORIZED);

        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User registeredUser = registrationService.register(user);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);

    }
}
