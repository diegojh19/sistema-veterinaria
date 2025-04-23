package sistema.veterinaria.backend.infrastructure.emailpassword.controller;

import sistema.veterinaria.backend.infrastructure.emailpassword.dto.ChangePasswordDTO;
import sistema.veterinaria.backend.infrastructure.emailpassword.dto.EmailValuesDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import sistema.veterinaria.backend.application.UserService;
import sistema.veterinaria.backend.domain.model.User;
import sistema.veterinaria.backend.infrastructure.adapter.UserRepositoryImpl;
import sistema.veterinaria.backend.infrastructure.emailpassword.dto.EmailValuesDto;
import sistema.veterinaria.backend.infrastructure.emailpassword.service.EmailService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/email-password")
@CrossOrigin(origins = "http://localhost:4200")
public class EmailController {

    @Autowired
    EmailService emailService;
    @Autowired
    UserService userService;
    @Value("${spring.mail.username}")
    private String mailFrom;

    @Autowired
    PasswordEncoder passwordEncoder;

    private final UserRepositoryImpl userRepository;

    private static final String subject = "Cambio de Contraseña";

    public EmailController(UserRepositoryImpl userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/send-email")
    public ResponseEntity<?> sendEmailTemplate(@RequestBody EmailValuesDto dto){
        try {
            // Buscar al usuario por email
            User user = userService.finByEmail(dto.getMailTo());
            if (user == null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Invalid email or password.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Preparar datos para el envío del email
            dto.setMailFrom(mailFrom);
            dto.setMailTo(user.getEmail());
            dto.setSubject(subject);
            dto.setUserName(user.getUsername());
            UUID uuid = UUID.randomUUID();
            String tokenPassword = uuid.toString();
            dto.setTokenpassword(tokenPassword);
            user.setTokenPassword(tokenPassword);
            // Guardar el usuario con el nuevo token
            userService.save(user);


            // Enviar el email
            emailService.sendEmail(dto);

            // Responder con mensaje de éxito
            Mensaje mensaje = new Mensaje("Te hemos enviado un correo");
            return new ResponseEntity<>(mensaje, HttpStatus.OK);

        } catch (Exception e) {
            // Manejar excepciones y devolver un mensaje de error
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error no existe el correo.");
            //errorResponse.put("error", e.getMessage()); //  incluir detalles del error
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }


    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO dto, BindingResult bindingResult) {
        if(bindingResult.hasErrors())
            return new ResponseEntity<>("Campos mal puestos", HttpStatus.BAD_REQUEST);
        if(!dto.getPassword().equals(dto.getConfirmPassword()))
            return new ResponseEntity<>("Las contraseñas no coinciden", HttpStatus.BAD_REQUEST);

        User user = userService.findByTokenPassword(dto.getTokenPassword());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid email or password.");
        }

        String newPassword = passwordEncoder.encode(dto.getPassword());

        user.setPassword(newPassword);
        user.setTokenPassword(null);
        userService.save(user);

        Mensaje mensaje = new Mensaje("Contraseña actualizada");

        // Retornar una ResponseEntity con el mensaje y el código de estado HTTP 200 (OK)
        return new ResponseEntity<>(mensaje, HttpStatus.OK);

        //return new ResponseEntity<>("Contraseña actualizada", HttpStatus.OK);

    }

}
