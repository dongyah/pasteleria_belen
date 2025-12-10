package com.example.backend.BackEnd.auth;

import com.example.backend.BackEnd.model.Usuario;
import com.example.backend.BackEnd.repository.UsuarioRepository;
import com.example.backend.BackEnd.jwt.JwtService; 
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collections;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional; 
import java.util.stream.Collectors; 


@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        
        // 1. Crear la entidad Usuario
        Usuario nuevoUsuario = new Usuario();
        
        nuevoUsuario.setNombreUsuario(request.getNombreUsuario());
        nuevoUsuario.setApellidosUsuario(request.getApellidosUsuario());
        nuevoUsuario.setRutUsuario(request.getRutUsuario());
        nuevoUsuario.setCorreoUsuario(request.getCorreoUsuario());
        nuevoUsuario.setTelefonoUsuario(request.getTelefonoUsuario());
        nuevoUsuario.setRegionUsuario(request.getRegionUsuario());
        nuevoUsuario.setComunaUsuario(request.getComunaUsuario());
        nuevoUsuario.setDireccionUsuario(request.getDireccionUsuario());
        nuevoUsuario.setFechaNacUsuario(request.getFechaNacUsuario()); 
        
        nuevoUsuario.setPasswordUsuario(passwordEncoder.encode(request.getPasswordUsuario()));
        
        String rol = request.getTipoUsuarioUsuario() != null ? request.getTipoUsuarioUsuario() : "Cliente";
        nuevoUsuario.setTipoUsuarioUsuario(rol);
        nuevoUsuario.setCodigoDescuentoUsuario(request.getCodigoDescuentoUsuario());

        // 2. Guardar en la base de datos
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);
        
        // 3. Generar JWT
        List<GrantedAuthority> authorities = Collections.singletonList(
             new SimpleGrantedAuthority("ROLE_" + rol.toUpperCase())
        );
        
        UserDetails userDetails = new User(
             usuarioGuardado.getCorreoUsuario(),
             usuarioGuardado.getPasswordUsuario(),
             authorities
        );
        String jwtToken = jwtService.generateToken(userDetails);
        
        // 4. Devolver la respuesta mapeando el ID y ROL
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .idUsuario(usuarioGuardado.getIdUsuario()) 
                .role(usuarioGuardado.getTipoUsuarioUsuario())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        
        // 1. Autenticar credenciales
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getCorreoUsuario(), 
                        request.getPasswordUsuario() 
                )
        );

        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreoUsuario(request.getCorreoUsuario());
        var usuario = usuarioOpt.orElseThrow(() -> new RuntimeException("Usuario no encontrado tras autenticación exitosa."));

        List<GrantedAuthority> authorities = Collections.singletonList(
             new SimpleGrantedAuthority("ROLE_" + usuario.getTipoUsuarioUsuario().toUpperCase())
        );
        UserDetails userDetails = new User(
             usuario.getCorreoUsuario(),
             usuario.getPasswordUsuario(),
             authorities
        );

        String jwtToken = jwtService.generateToken(userDetails);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .idUsuario(usuario.getIdUsuario())
                .role(usuario.getTipoUsuarioUsuario())
                .build();
    }
}