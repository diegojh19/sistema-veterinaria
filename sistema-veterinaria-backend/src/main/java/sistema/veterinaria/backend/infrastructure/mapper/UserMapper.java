package sistema.veterinaria.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import sistema.veterinaria.backend.domain.model.User;
import sistema.veterinaria.backend.infrastructure.Entity.UserEntity;

@Mapper(componentModel = "spring")
public interface UserMapper {

        @Mappings({
                @Mapping(source = "id", target = "id"),
                @Mapping(source = "username", target = "username"),
                @Mapping(source = "firstName", target = "firstName"),
                @Mapping(source = "lastName", target = "lastName"),
                @Mapping(source = "email", target = "email"),
                @Mapping(source = "address", target = "address"),
                @Mapping(source = "cellphone", target = "cellphone"),
                @Mapping(source = "password", target = "password"),
                @Mapping(source = "userType", target = "userType"),
                @Mapping(source = "tokenPassword", target = "tokenPassword"),
                @Mapping(source = "correoVerificado", target = "correoVerificado"),
                @Mapping(source = "verificationToken", target = "verificationToken"),
                @Mapping(source = "fechaExpiracion", target = "fechaExpiracion")
        })
        User toUser(UserEntity userEntity);

        @Mappings({
                @Mapping(source = "id", target = "id"),
                @Mapping(source = "username", target = "username"),
                @Mapping(source = "firstName", target = "firstName"),
                @Mapping(source = "lastName", target = "lastName"),
                @Mapping(source = "email", target = "email"),
                @Mapping(source = "address", target = "address"),
                @Mapping(source = "cellphone", target = "cellphone"),
                @Mapping(source = "password", target = "password"),
                @Mapping(source = "userType", target = "userType"),
                @Mapping(source = "tokenPassword", target = "tokenPassword"),
                @Mapping(source = "correoVerificado", target = "correoVerificado"),
                @Mapping(source = "verificationToken", target = "verificationToken"),
                @Mapping(source = "fechaExpiracion", target = "fechaExpiracion")
        })
        UserEntity touserEntity(User user);

        Iterable<User> toUsers(Iterable<UserEntity> userEntities);
    }
