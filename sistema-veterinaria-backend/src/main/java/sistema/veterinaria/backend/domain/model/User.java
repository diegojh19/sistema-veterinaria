package sistema.veterinaria.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    private Integer id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String address;
    private String cellphone;
    private String password;
    private UserType userType;
    private String tokenPassword;

    private boolean correoVerificado = false; // Por defecto, no verificado
    private String verificationToken; // Token de verificación
    private LocalDateTime fechaExpiracion; // Fecha de expiración del token de verificación
}
