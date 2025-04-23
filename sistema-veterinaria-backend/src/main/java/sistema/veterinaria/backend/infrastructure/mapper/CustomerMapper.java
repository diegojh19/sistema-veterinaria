package sistema.veterinaria.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import sistema.veterinaria.backend.domain.model.Customer;
import sistema.veterinaria.backend.infrastructure.Entity.CustomerEntity;

@Mapper(componentModel = "spring")

public interface CustomerMapper {
    @Mappings(
            {
                    @Mapping(source = "id", target = "id"),
                    @Mapping(source = "name_customer", target = "name_customer"),
                    @Mapping(source = "surname_customer", target = "surname_customer"),
                    @Mapping(source = "photo_customer", target = "photo_customer"),
                    @Mapping(source = "citizenship_card", target = "citizenship_card"),
                    @Mapping(source = "cellphone_customer", target = "cellphone_customer"),
                    @Mapping(source = "address", target = "address"),
                    @Mapping(source = "city", target = "city"),
                    @Mapping(source = "email_customer", target = "email_customer")
            }
    )
    Customer toCustomer(CustomerEntity customerEntity);
    Iterable<Customer> toCustomerList(Iterable<CustomerEntity> customerEntities);

    @InheritInverseConfiguration
    CustomerEntity toCustomerEntity(Customer customer);
}
