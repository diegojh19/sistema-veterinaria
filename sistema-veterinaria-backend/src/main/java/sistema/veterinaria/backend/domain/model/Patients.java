package sistema.veterinaria.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Patients {

    private Integer id;
    private String name_patients;
    private String photo_patients;
    private Date birthdate;
    private String age;
    private String sex;
    private String color;
    private String fur;
    private String allergy;
    private Integer breeds_idbreeds;
    private Integer customer_idcustomer;

}
