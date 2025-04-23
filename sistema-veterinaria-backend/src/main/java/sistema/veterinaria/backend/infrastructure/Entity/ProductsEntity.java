package sistema.veterinaria.backend.infrastructure.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "products")
@NoArgsConstructor
@Data
public class ProductsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;
    private String name_products;
    private String description;
    private String brand;
    private String price;
    private String stock;
    private String dose;
    private Date expiration_Date;

    @ManyToOne
    private CategoryEntity categoryEntity;
}
