package com.example.backend.BackEnd.config;

import com.example.backend.BackEnd.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer; 
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true) 
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        
        http
                
                .cors(Customizer.withDefaults()) 
                .csrf(AbstractHttpConfigurer::disable)
                
                .authorizeHttpRequests(auth -> auth
                        
                        
                        .requestMatchers(
                            
                            "/api/v1/auth/**",
                            "/api/v1/usuarios/save",
                            
                            // GET de productos y categorías es público (lectura)
                            "/api/v1/productos/all",
                            "/api/v1/productos/find/**",
                            "/api/v1/categorias/**",
                            
                            
                            "/api/v1/ordenes/create", 
                            
                            
                            "/swagger-ui/**", 
                            "/v3/api-docs/**"
                            
                        ).permitAll()
                        
                        
                        .anyRequest().authenticated()
                )
                
                
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                
                .authenticationProvider(authenticationProvider) 
                
                
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}