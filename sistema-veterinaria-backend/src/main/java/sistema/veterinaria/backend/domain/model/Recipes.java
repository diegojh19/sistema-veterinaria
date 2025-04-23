package sistema.veterinaria.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Recipes {

    private Integer id;
    private Date recipe_date;
    private String description;
    private String indications;
    private Integer patients_idpatients;

}
