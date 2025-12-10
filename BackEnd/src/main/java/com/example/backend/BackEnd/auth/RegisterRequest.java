package com.example.backend.BackEnd.auth;

import java.time.LocalDate;

import lombok.Data;

@Data
public class RegisterRequest {

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
