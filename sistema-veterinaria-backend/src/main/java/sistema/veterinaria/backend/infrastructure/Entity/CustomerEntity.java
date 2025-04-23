package sistema.veterinaria.backend.infrastructure.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
public class CustomerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name_customer;
    private String surname_customer;
    private String photo_customer;
    private String citizenship_card;
    private String cellphone_customer;
    private String address;
    private String city;
    private String email_customer;
}
