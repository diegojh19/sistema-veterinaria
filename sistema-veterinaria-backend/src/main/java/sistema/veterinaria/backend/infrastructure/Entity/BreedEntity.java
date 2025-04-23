package sistema.veterinaria.backend.infrastructure.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "breed")
@NoArgsConstructor
@Data

public class BreedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;
    @NotBlank(message = "El nombre de la raza no puede estar vacío")
    private String name_breeds;

    @ManyToOne
    @NotNull(message = "La especie asociada no puede ser nula")
    private SpeciesEntity speciesEntity;
}
