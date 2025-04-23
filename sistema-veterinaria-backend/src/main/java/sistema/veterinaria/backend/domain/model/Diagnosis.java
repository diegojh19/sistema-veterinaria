package sistema.veterinaria.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Diagnosis {
    private Integer id;
    private String detail_diagnosis;
    private Date date_diagnosis;
    private Integer queries_idqueries;

}
