package sistema.veterinaria.backend.infrastructure.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import sistema.veterinaria.backend.domain.model.Customer;

import java.util.Date;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
public class PatientsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name_patients;
    private String photo_patients;
    private Date birthdate;
    private String age;
    private String sex;
    private String color;
    private String fur;
    private String allergy;

    @ManyToOne
    private BreedEntity breedEntity;
    @ManyToOne
    private CustomerEntity customerEntity;
}
