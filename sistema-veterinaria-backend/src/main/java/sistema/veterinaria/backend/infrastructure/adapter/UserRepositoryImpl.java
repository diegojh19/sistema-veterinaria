package sistema.veterinaria.backend.infrastructure.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import sistema.veterinaria.backend.domain.model.User;
import sistema.veterinaria.backend.domain.port.IUserRepository;
import sistema.veterinaria.backend.infrastructure.Entity.UserEntity;
import sistema.veterinaria.backend.infrastructure.emailverification.service.EmailServices;
import sistema.veterinaria.backend.infrastructure.mapper.UserMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public class UserRepositoryImpl implements IUserRepository {

    @Autowired
    private final IUserCrudRepository iUserCrudRepository;

    @Autowired
    private final UserMapper userMapper;

    private final EmailServices emailService;
    public UserRepositoryImpl(IUserCrudRepository iUserCrudRepository, UserMapper userMapper, EmailServices emailService) {
        this.iUserCrudRepository = iUserCrudRepository;
        this.userMapper = userMapper;
        this.emailService = emailService;
    }

    @Override
    public User save(User user) {
        // Generamos un token de verificación único
        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);

        // Establecemos la fecha de expiración (2 minutos en este ejemplo)
        LocalDateTime fechaExpiracion =LocalDateTime.now().plusMinutes(30);
        user.setFechaExpiracion(fechaExpiracion);

        // Imprimir el token y la fecha para verificar que se están asignando correctamente
        System.out.println("Token de verificación generado: " + user.getVerificationToken());
        System.out.println("Fecha de expiración: " + user.getFechaExpiracion());

        // Convertimos el usuario a la entidad y lo guardamos en la base de datos
        UserEntity userEntity = userMapper.touserEntity(user);

        // (Opcional) Verificamos si el token se mapeó correctamente
        System.out.println("Token en UserEntity: " + userEntity.getVerificationToken());

        userEntity = iUserCrudRepository.save(userEntity);

        // Convertimos la entidad guardada a un objeto de tipo User
        User savedUser = userMapper.toUser(userEntity);

        // Enviamos el correo con el token al usuario
        try {
            emailService.sendVerificationEmail(savedUser.getEmail(), verificationToken);
        } catch (Exception e) {
            // Manejar el caso de error al enviar el correo
            System.err.println("Error al enviar el correo de verificación: " + e.getMessage());
        }

        return savedUser; // Retornamos el usuario guardado
    }




    @Override
    public User update(Integer id, User user) {
        return userMapper.toUser(iUserCrudRepository.save(userMapper.touserEntity(user)));
    }

    @Override
    public Iterable<User> findAll() {
        return userMapper.toUsers(iUserCrudRepository.findAll());

    }

    @Override
    public User findById(Integer id) {
        return userMapper.toUser(iUserCrudRepository.findById(id).get());

    }

    @Override
    public void deleteById(Integer id) {

        iUserCrudRepository.findById(id).orElseThrow(
                ()-> new RuntimeException("users con id "+id+ " no existe")
        );
        iUserCrudRepository.deleteById(id);

    }

    @Override
    public void deleteAllByIdIn(List<Integer> ids) {

        if (ids != null && !ids.isEmpty()) {
            // Asegúrate de que el repositorio esté correctamente configurado para eliminar múltiples registros
            iUserCrudRepository.deleteAllByIdIn(ids);
        } else {
            throw new IllegalArgumentException("La lista de IDs no puede estar vacía.");
        }

    }

    @Override
    public User findByEmail(String email) {
        return userMapper.toUser(iUserCrudRepository.findByEmail(email).orElseThrow(
                () -> new RuntimeException("Usuario con email: " + email + " no encontrado")
        ));
    }

    public boolean verificarUsuario(String token) {
        System.out.println("Buscando usuario con token: " + token);
        UserEntity userEntity = iUserCrudRepository.findByVerificationToken(token);

        if (userEntity != null) {
            System.out.println("Usuario encontrado: " + userEntity.getEmail());

            if (userEntity.getFechaExpiracion().isBefore(LocalDateTime.now())) {
                System.out.println("Token expirado");
                return false;
            }

            System.out.println("Token válido. Verificando correo...");
            userEntity.setCorreoVerificado(true);
            userEntity.setVerificationToken(null);
            userEntity.setFechaExpiracion(null);
            iUserCrudRepository.save(userEntity);
            return true;
        }

        System.out.println("Token inválido o no encontrado.");
        return false;
    }


    public boolean existsByEmail(String email) {
        return iUserCrudRepository.existsByEmail(email);
    }

    // Método para encontrar un usuario por el token de recuperación de contraseña
    public User findByTokenPassword(String tokenPassword) {
        return userMapper.toUser(iUserCrudRepository.findByTokenPassword(tokenPassword).orElseThrow(
                () -> new RuntimeException("Token de recuperación de contraseña no válido")
        ));
    }
}
