package sistema.veterinaria.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import sistema.veterinaria.backend.domain.model.Diagnosis;
import sistema.veterinaria.backend.infrastructure.Entity.DiagnosisEntity;

import java.util.Date;

@Mapper(componentModel = "spring")
public interface DiagnosisMapper {

    @Mappings(
            {
                    @Mapping(source = "id", target = "id"),
                    @Mapping(source = "detail_diagnosis", target = "detail_diagnosis"),
                    @Mapping(source = "date_diagnosis", target = "date_diagnosis"),
                    @Mapping(source = "queriesEntity.id", target = "queries_idqueries")
            }
    )
    Diagnosis toDiagnosis(DiagnosisEntity diagnosisEntity);
    Iterable<Diagnosis> toDiagnosisList(Iterable<DiagnosisEntity> diagnosisEntities);

    @InheritInverseConfiguration
    DiagnosisEntity toDiagnosisEntity(Diagnosis diagnosis);
}
