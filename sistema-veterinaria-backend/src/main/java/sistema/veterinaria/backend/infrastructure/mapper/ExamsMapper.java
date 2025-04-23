package sistema.veterinaria.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import sistema.veterinaria.backend.domain.model.Exams;
import sistema.veterinaria.backend.infrastructure.Entity.ExamsEntity;

@Mapper(componentModel = "spring")

public interface ExamsMapper {

    @Mappings(
            {
                    @Mapping(source = "id", target = "id"),
                    @Mapping(source = "mucous_membrane", target = "mucous_membrane"),
                    @Mapping(source = "fur", target = "fur"),
                    @Mapping(source = "oral", target = "oral"),
                    @Mapping(source = "reproductive_system", target = "reproductive_system"),
                    @Mapping(source = "rectal", target = "rectal"),
                    @Mapping(source = "eyes", target = "eyes"),
                    @Mapping(source = "lymph_modules", target = "lymph_modules"),
                    @Mapping(source = "locomotion", target = "locomotion"),
                    @Mapping(source = "cardiovascular_system", target = "cardiovascular_system"),
                    @Mapping(source = "respiratory_system", target = "respiratory_system"),
                    @Mapping(source = "digestive_system", target = "digestive_system"),
                    @Mapping(source = "urinary_system", target = "urinary_system"),
                    @Mapping(source = "queriesEntity.id", target = "queries_idqueries")
            }
    )
    Exams toExams(ExamsEntity examsEntity);
    Iterable<Exams> toExamsList(Iterable<ExamsEntity> examsEntities);

    @InheritInverseConfiguration
    ExamsEntity toExamsEntity(Exams exams);
}

