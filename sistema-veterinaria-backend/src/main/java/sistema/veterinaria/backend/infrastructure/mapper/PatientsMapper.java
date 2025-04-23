package sistema.veterinaria.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import sistema.veterinaria.backend.domain.model.Patients;
import sistema.veterinaria.backend.infrastructure.Entity.PatientsEntity;

import java.util.Date;

@Mapper(componentModel = "spring")

public interface PatientsMapper {

    @Mappings(
            {
                    @Mapping(source = "id", target = "id"),
                    @Mapping(source = "name_patients", target = "name_patients"),
                    @Mapping(source = "photo_patients", target = "photo_patients"),
                    @Mapping(source = "birthdate", target = "birthdate"),
                    @Mapping(source = "age", target = "age"),
                    @Mapping(source = "sex", target = "sex"),
                    @Mapping(source = "color", target = "color"),
                    @Mapping(source = "fur", target = "fur"),
                    @Mapping(source = "allergy", target = "allergy"),
                    @Mapping(source = "breedEntity.id", target = "breeds_idbreeds"),
                    @Mapping(source = "customerEntity.id", target = "customer_idcustomer")


            }
    )
    Patients toPatients(PatientsEntity patientsEntity);
    Iterable<Patients> toPatientsList(Iterable<PatientsEntity> patientsEntities);

    @InheritInverseConfiguration
    PatientsEntity toPatientsEntity(Patients patients);
}

