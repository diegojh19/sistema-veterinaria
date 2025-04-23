package sistema.veterinaria.backend.infrastructure.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "diagnosis")
@Data
@NoArgsConstructor
public class DiagnosisEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String detail_diagnosis;
    private Date date_diagnosis;
    @ManyToOne
    private QueriesEntity queriesEntity;
}
