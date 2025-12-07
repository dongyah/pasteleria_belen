package com.example.backend.BackEnd.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;
    
    private String nombreUsuario;
    private String apellidosUsuario;
    private LocalDate fechaNacUsuario;
    private String rutUsuario;
    private String correoUsuario;
    private String telefonoUsuario;
    private String regionUsuario;
    private String comunaUsuario;
    private String direccionUsuario;
    private String passwordUsuario;
    private String tipoUsuarioUsuario;
    private String codigoDescuentoUsuario;

    
}
