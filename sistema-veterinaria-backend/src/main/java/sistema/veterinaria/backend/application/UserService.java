package sistema.veterinaria.backend.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import sistema.veterinaria.backend.domain.model.User;
import sistema.veterinaria.backend.domain.port.IBreedRepository;
import sistema.veterinaria.backend.domain.port.IUserRepository;

import java.util.List;

public class UserService {

    @Autowired
    private final IUserRepository iUserRepository;

    public UserService(IUserRepository iUserRepository) {
        this.iUserRepository = iUserRepository;
    }

    public User save(User user){
        return iUserRepository.save(user);
    }
    public User update(Integer id,User user){
        return iUserRepository.save(user);
    }
    public Iterable<User> findAll(){
        return iUserRepository.findAll();
    }
    public User findById(Integer id){
        return iUserRepository.findById(id);
    }
    public void deleteById(Integer id){
        iUserRepository.deleteById(id);
    }

    public void deleteMultiplesUsers(List<Integer> ids) {
        try {
            for (Integer id : ids) {
                iUserRepository.deleteById(id);  // Verifica que el método deleteById no lance ninguna excepción
            }
        } catch (DataAccessException e) {
            // Loguear el error con detalles específicos para base de datos
            System.out.println("Error en la base de datos: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los usuarios");
        } catch (Exception e) {
            // Loguear cualquier otro tipo de excepción
            System.out.println("Error general: " + e.getMessage());
            throw new RuntimeException("Error al eliminar los usuarios");
        }
    }

    public User finByEmail(String email){
        return iUserRepository.findByEmail(email);
    }

    public  boolean existsByEmail(String email) {
        return iUserRepository.existsByEmail(email);
    }
    public User findByTokenPassword(String tokenPassword){
        return iUserRepository.findByTokenPassword(tokenPassword);
    }

    public boolean verificarUsuario(String token){
        return iUserRepository.verificarUsuario(token);
    }
}
