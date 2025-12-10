package com.example.backend.BackEnd.config;

import com.example.backend.BackEnd.model.Usuario;
import com.example.backend.BackEnd.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreoUsuario(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con correo: " + email));

        
        String roleName = usuario.getTipoUsuarioUsuario().toUpperCase(); 
        
        
        var authority = new SimpleGrantedAuthority("ROLE_" + roleName);

        return new User(
                usuario.getCorreoUsuario(),
                usuario.getPasswordUsuario(),
                Collections.singletonList(authority)
        );
    }
}