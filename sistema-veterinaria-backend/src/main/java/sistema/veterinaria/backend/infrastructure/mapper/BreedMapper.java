package sistema.veterinaria.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import sistema.veterinaria.backend.domain.model.Breed;
import sistema.veterinaria.backend.infrastructure.Entity.BreedEntity;

@Mapper(componentModel = "spring")

public interface BreedMapper {
    @Mappings(
            {
                    @Mapping(source = "id", target = "id"),
                    @Mapping(source = "name_breeds", target = "name_breeds"),
                    @Mapping(source = "speciesEntity.id", target = "speciesId")

            }
    )
    Breed toBreed(BreedEntity breedEntity);
    Iterable<Breed> toBreedList(Iterable<BreedEntity> breedEntities);

    @InheritInverseConfiguration
    BreedEntity tobreedEntity(Breed breed);

}
