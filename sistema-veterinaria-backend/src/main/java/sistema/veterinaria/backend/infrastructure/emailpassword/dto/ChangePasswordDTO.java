package sistema.veterinaria.backend.infrastructure.emailpassword.dto;

import lombok.Data;

@Data
public class ChangePasswordDTO {

    private String password;

    private String confirmPassword;

    private String tokenPassword;
}
