package sistema.veterinaria.backend.infrastructure.rest;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import sistema.veterinaria.backend.application.UserService;
import sistema.veterinaria.backend.domain.model.User;
import sistema.veterinaria.backend.infrastructure.dto.JWTClient;
import sistema.veterinaria.backend.infrastructure.dto.UserDTO;
import sistema.veterinaria.backend.infrastructure.jwt.JWTGenerator;

import java.time.LocalDateTime;


@RestController
@RequestMapping("/api/v1/security")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class LoginController {

    private final JWTGenerator jwtGenerator;

    private final AuthenticationManager authenticationManager;

    private final UserService userService;

    public LoginController(JWTGenerator jwtGenerator, AuthenticationManager authenticationManager, UserService userService) {
        this.jwtGenerator = jwtGenerator;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }


    @PostMapping("/login")

    public ResponseEntity<?> login(@RequestBody UserDTO userDTO) {
        try {
            // Buscar el usuario por su email
            User user = userService.finByEmail(userDTO.username());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMessage("Correo electrónico o contraseña no válidos."));
            }

            // Verificar si el correo ha sido validado
            if (!user.isCorreoVerificado()) {
                throw new DisabledException("El correo electrónico no ha sido verificado.");
            }

            LocalDateTime fechaExpiracion = user.getFechaExpiracion();
            if (fechaExpiracion != null && fechaExpiracion.isBefore(LocalDateTime.now())) {
                throw new DisabledException("El token ha expirado.");
            }

            // Autenticar al usuario
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userDTO.username(), userDTO.password())
            );

            // Establecer el contexto de autenticación
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generar el token JWT
            String token = jwtGenerator.getToken(userDTO.username());
            JWTClient jwtClient = new JWTClient(user.getId(), token, user.getUserType().toString());

            return ResponseEntity.ok(jwtClient);
        } catch (DisabledException e) {
            // Si el correo no ha sido verificado, lanzar una respuesta con un mensaje adecuado
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorMessage("El correo electrónico no ha sido verificado. Por favor, revisa tu bandeja de entrada."));
        } catch (BadCredentialsException e) {
            // Si las credenciales son incorrectas, devolver un mensaje de error
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMessage("Correo electrónico o contraseña no válidos."));
        } catch (Exception e) {
            // Si ocurre cualquier otro error, manejarlo aquí
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorMessage("Error en el inicio de sesión."));
        }
    }
}










