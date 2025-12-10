package com.example.backend.BackEnd.dto; 

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDataDTO {
    
    private String nombre;
    private String apellidos;
    private String correo;
    private String rut; 
    private String telefono; 
    
    // Información de Envío
    private String calle;
    private String departamento;
    private String region;
    private String comuna;
    private String indicaciones; 
}