package sistema.veterinaria.backend.infrastructure.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "treatments")
@NoArgsConstructor
@Data
public class TreatmentsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;
    private String detail_treatments;

    @ManyToOne
    private DiagnosisEntity diagnosisEntity;

}

