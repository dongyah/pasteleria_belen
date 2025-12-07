package com.example.backend.BackEnd.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.BackEnd.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
  
    // Método requerido para la lógica de inicio de sesión
    Optional<Usuario> findByCorreo(String correoUsuario);
}
