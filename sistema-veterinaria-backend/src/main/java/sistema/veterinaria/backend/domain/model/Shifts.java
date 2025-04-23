package sistema.veterinaria.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Shifts {

    private Integer id;
    private Date start;
    private  Date end;
    private String title;
    private Integer customer_idcustomer;

}
