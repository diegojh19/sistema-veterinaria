package sistema.veterinaria.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Treatments {
    private Integer id;
    private String detail_treatments;
    private Integer diagnosis_iddianosis;

}
