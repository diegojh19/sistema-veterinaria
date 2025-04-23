package sistema.veterinaria.backend.application;

import org.springframework.beans.factory.annotation.Autowired;
import sistema.veterinaria.backend.domain.model.User;
import sistema.veterinaria.backend.domain.port.IUserRepository;

public class RegistrationService {

    @Autowired
    private final IUserRepository iUserRepository;

    public RegistrationService(IUserRepository iUserRepository) {
        this.iUserRepository = iUserRepository;
    }

    public User register(User user){
        return iUserRepository.save(user);

    }
    public boolean existsByEmail(String email) {
        return iUserRepository.existsByEmail(email);
    }

}
