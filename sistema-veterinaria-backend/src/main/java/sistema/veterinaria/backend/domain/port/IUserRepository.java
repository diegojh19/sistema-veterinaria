package sistema.veterinaria.backend.domain.port;


import sistema.veterinaria.backend.domain.model.User;

import java.util.List;

public interface IUserRepository {

   User save(User user);

   User update(Integer id, User user);

    Iterable<User> findAll();

    User findById(Integer id);

    void deleteById(Integer id);

    void deleteAllByIdIn(List<Integer> ids) ;

    User findByEmail(String email);

    User findByTokenPassword(String tokenPassword);

    boolean existsByEmail(String email);
    boolean verificarUsuario(String token);
}



