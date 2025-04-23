package sistema.veterinaria.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import sistema.veterinaria.backend.domain.model.Species;
import sistema.veterinaria.backend.infrastructure.Entity.SpeciesEntity;

@Mapper(componentModel = "spring")

public interface SpeciesMapper {
    @Mappings(
            {
                    @Mapping(source = "id", target = "id"),
                    @Mapping(source = "name_species", target = "name_species")

            }
    )
    Species toSpecies(SpeciesEntity speciesEntity);
    Iterable<Species> toSpeciesList(Iterable<SpeciesEntity> speciesEntities);

    @InheritInverseConfiguration
    SpeciesEntity toSpeciesEntity(Species species);
}
