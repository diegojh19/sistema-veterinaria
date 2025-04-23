package sistema.veterinaria.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import sistema.veterinaria.backend.domain.model.Recipes;
import sistema.veterinaria.backend.infrastructure.Entity.RecipesEntity;

import java.util.Date;

@Mapper(componentModel = "spring")
public interface RecipesMapper {
    @Mappings(
            {
                    @Mapping(source = "id", target = "id"),
                    @Mapping(source = "recipe_date", target = "recipe_date"),
                    @Mapping(source = "description", target = "description"),
                    @Mapping(source = "indications", target = "indications"),
                    @Mapping(source = "patientsEntity.id", target = "patients_idpatients"),

            }
    )
    Recipes toRecipes(RecipesEntity recipesEntity);
    Iterable<Recipes> toRecipesList(Iterable<RecipesEntity> recipesEntities);

    @InheritInverseConfiguration
    RecipesEntity toRecipesEntity(Recipes recipes);
}
