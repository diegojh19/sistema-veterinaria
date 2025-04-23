package sistema.veterinaria.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class Exams {

    private Integer id;
    private String mucous_membrane;
    private String fur;
    private String oral;
    private String reproductive_system;
    private String rectal;
    private String eyes;
    private String lymph_modules;
    private String locomotion;
    private String cardiovascular_system;
    private String respiratory_system;
    private String digestive_system;
    private String urinary_system;
    private Integer queries_idqueries;


}
