package sistema.veterinaria.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import sistema.veterinaria.backend.domain.model.Queries;
import sistema.veterinaria.backend.infrastructure.Entity.QueriesEntity;

import java.util.Date;

@Mapper(componentModel = "spring")

public interface QueriesMapper {
    @Mappings(
            {
                    @Mapping(source = "id", target = "id"),
                    @Mapping(source = "consultation_date", target = "consultation_date"),
                    @Mapping(source = "reason", target = "reason"),
                    @Mapping(source = "past", target = "past"),
                    @Mapping(source = "diseases", target = "diseases"),
                    @Mapping(source = "next_consultation", target = "next_consultation"),
                    @Mapping(source = "patientsEntity.id", target = "patients_idpatients")

            }
    )
    Queries toQueries(QueriesEntity categoryEntity);
    Iterable<Queries> toCategoryList(Iterable<QueriesEntity> queriesEntities);

    @InheritInverseConfiguration
    QueriesEntity toQueriesEntity(Queries queries);
}
