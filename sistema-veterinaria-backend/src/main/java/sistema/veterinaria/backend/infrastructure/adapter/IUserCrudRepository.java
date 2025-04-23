package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.data.repository.CrudRepository;
import sistema.veterinaria.backend.infrastructure.Entity.UserEntity;

import java.util.List;
import java.util.Optional;

public interface IUserCrudRepository extends CrudRepository<UserEntity, Integer> {

    void deleteAllByIdIn(List<Integer> ids);

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByTokenPassword(String tokenPassword);


    boolean existsByEmail(String email);

    // El método findByVerificationToken se usa para buscar un usuario a través del token de verificación.
    UserEntity findByVerificationToken(String token);

}
