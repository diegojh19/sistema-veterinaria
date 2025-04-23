package sistema.veterinaria.backend.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import sistema.veterinaria.backend.infrastructure.jwt.JWTAuthorizationFilter;


import java.util.Arrays;
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JWTAuthorizationFilter jwtAuthorizationFilter;

    public SecurityConfig(JWTAuthorizationFilter jwtAuthorizationFilter) {
        this.jwtAuthorizationFilter = jwtAuthorizationFilter;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity.cors(
                        cors -> cors.configurationSource(
                                request -> {
                                    CorsConfiguration corsConfiguration = new CorsConfiguration();
                                    corsConfiguration.setAllowedOrigins(Arrays.asList("*"));
                                    corsConfiguration.setAllowedMethods(Arrays.asList("*"));
                                    corsConfiguration.setAllowedHeaders(Arrays.asList("*"));
                                    return  corsConfiguration;
                                }
                        )).
        csrf( csrf-> csrf.disable()).authorizeHttpRequests(aut -> aut
                        .requestMatchers("/api/v1/admin/users/verify/**").permitAll()
                        .requestMatchers("/email-password/**").permitAll()
                        .requestMatchers("/api/v1/security/**").permitAll()
                        .requestMatchers("/images/**").permitAll()

                        // Las rutas protegidas van después
                        .requestMatchers("/api/v1/admin/breeds/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/categories/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/customers/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/diagnosis/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/exams/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/patients/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/products/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/queries/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/recipes/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/shifts/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/species/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/treatments/**").hasRole("ADMIN")
                        .requestMatchers("/api/v1/admin/users/**").hasRole("ADMIN") // Esto al final
                        .anyRequest().authenticated()
                ).addFilterAfter(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder (){
        return new BCryptPasswordEncoder();
    }
}
