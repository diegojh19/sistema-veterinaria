package sistema.veterinaria.backend.infrastructure.emailpassword.dto;

import lombok.Data;

@Data
public class EmailValuesDto {

    private String mailFrom;
    private String mailTo;
    private String subject;
    private String userName;
    private String tokenpassword;
}
