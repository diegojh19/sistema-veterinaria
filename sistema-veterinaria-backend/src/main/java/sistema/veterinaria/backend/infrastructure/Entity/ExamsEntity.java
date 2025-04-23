package sistema.veterinaria.backend.infrastructure.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exams")
@NoArgsConstructor
@Data

public class ExamsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

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

    @ManyToOne
    private QueriesEntity queriesEntity;

}
