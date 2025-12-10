package com.example.backend.BackEnd.dto; // 🔑 Crea este paquete

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    
    
    private Long usuarioId; 
    private Integer total; 

    
    private ClienteDataDTO cliente;

    
    private List<ProductoItemDTO> productos;
}