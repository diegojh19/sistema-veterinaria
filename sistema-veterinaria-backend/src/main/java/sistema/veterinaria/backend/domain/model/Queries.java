package sistema.veterinaria.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Queries {

    private  Integer id;
    private Date consultation_date;
    private String reason;
    private String past;
    private String diseases;
    private Date next_consultation;
    private Integer patients_idpatients;

}
