package sistema.veterinaria.backend.infrastructure.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "queries")
@NoArgsConstructor
@Data
public class QueriesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;
    private Date consultation_date;
    private String reason;
    private String past;
    private String diseases;
    private Date next_consultation;

    @ManyToOne
    private PatientsEntity patientsEntity;
}
