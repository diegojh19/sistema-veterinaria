package sistema.veterinaria.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Products {
    private Integer id;
    private String name_products;
    private String description;
    private String brand;
    private String price;
    private String stock;
    private Date expiration_Date;
    private String dose;
    private Integer categories_idcategories;

}
