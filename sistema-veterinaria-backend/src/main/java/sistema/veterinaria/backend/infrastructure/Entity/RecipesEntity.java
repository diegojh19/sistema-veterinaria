package sistema.veterinaria.backend.infrastructure.Entity;

import jakarta.persistence.*;
import lombok.Data;
import sistema.veterinaria.backend.domain.model.Patients;

import java.util.Date;

@Entity
@Table(name = "recipes")
@Data
public class RecipesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Date recipe_date;
    private String description;
    private String indications;

    @ManyToOne
    private PatientsEntity patientsEntity;


}
