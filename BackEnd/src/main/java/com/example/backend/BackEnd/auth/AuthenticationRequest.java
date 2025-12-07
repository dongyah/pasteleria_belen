package com.example.backend.BackEnd.auth; 

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationRequest {
    
    // El frontend envía el correo y la contraseña.
    private String correo;
    private String password;
}