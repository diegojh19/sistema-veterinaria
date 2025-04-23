package sistema.veterinaria.backend.infrastructure.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import sistema.veterinaria.backend.application.UserService;
import sistema.veterinaria.backend.domain.model.User;

import java.time.LocalDateTime;
@Service
public class CustomUserDetailService implements UserDetailsService {
    @Autowired
     private UserService userService;

    public CustomUserDetailService(UserService userService){
        this.userService = userService;
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.finByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("Usuario no encontrado con el email: " + username);
        }

        // Verificar si el correo ha sido validado
        if (!user.isCorreoVerificado()) {
            throw new DisabledException("El correo electrónico no ha sido verificado.");
        }

        // Verificar si el token de verificación ha expirado
        if (user.getFechaExpiracion() != null && user.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            throw new DisabledException("El token de verificación ha expirado.");
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getUserType().name())
                .build();
    }

}
