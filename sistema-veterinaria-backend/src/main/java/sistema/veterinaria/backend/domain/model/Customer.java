package sistema.veterinaria.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Customer {
   private Integer  id;
   private String name_customer;
   private String surname_customer;
   private String photo_customer;
   private String citizenship_card;
   private String cellphone_customer;
   private String address;
   private String city;
   private String email_customer;

}

