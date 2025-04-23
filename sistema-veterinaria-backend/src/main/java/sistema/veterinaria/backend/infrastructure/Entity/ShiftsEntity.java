package sistema.veterinaria.backend.infrastructure.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "shifts")
@Data
@NoArgsConstructor
public class ShiftsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "[start]")
    private Date start;

    @Column(name = "[end]")
    private Date end;
    private String title;
    @ManyToOne
    private CustomerEntity customerEntity;

}
