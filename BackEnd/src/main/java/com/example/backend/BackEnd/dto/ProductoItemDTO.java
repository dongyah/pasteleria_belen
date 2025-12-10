package com.example.backend.BackEnd.dto; 

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoItemDTO {
    
    private String productoNombre; 
    private Long productoId;       
    private Integer cantidad;      
    private Double precioUnitario; 
}