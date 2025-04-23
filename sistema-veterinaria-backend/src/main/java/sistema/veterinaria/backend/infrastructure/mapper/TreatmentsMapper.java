package sistema.veterinaria.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import sistema.veterinaria.backend.domain.model.Treatments;
import sistema.veterinaria.backend.infrastructure.Entity.TreatmentsEntity;

@Mapper(componentModel = "spring")
public interface TreatmentsMapper {

    @Mappings(
            {
                    @Mapping(source = "id", target = "id"),
                    @Mapping(source = "detail_treatments", target = "detail_treatments"),
                    @Mapping(source = "diagnosisEntity.id", target = "diagnosis_iddianosis")
            }
    )
    Treatments toTreatments(TreatmentsEntity treatmentsEntity);
    Iterable<Treatments> toTreatmentsList(Iterable<TreatmentsEntity> treatmentsEntities);

    @InheritInverseConfiguration
    TreatmentsEntity toTreatmentsEntity(Treatments treatments);

}
