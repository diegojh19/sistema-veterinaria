package sistema.veterinaria.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import sistema.veterinaria.backend.domain.model.Shifts;
import sistema.veterinaria.backend.infrastructure.Entity.ShiftsEntity;

import java.util.Date;

@Mapper(componentModel = "spring")
public interface ShiftsMapper {
    @Mappings(
            {
                    @Mapping(source = "id", target = "id"),
                    @Mapping(source = "start", target = "start"),
                    @Mapping(source = "end", target = "end"),
                    @Mapping(source = "title", target = "title"),
                    @Mapping(source = "customerEntity.id", target = "customer_idcustomer")

            }
    )
    Shifts toShifts(ShiftsEntity shiftsEntity);
    Iterable<Shifts> toShiftsList(Iterable<ShiftsEntity> shiftsEntities);

    @InheritInverseConfiguration
    ShiftsEntity toShiftsEntity(Shifts shifts);
}
