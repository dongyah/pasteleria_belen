package com.example.backend.BackEnd.model;

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
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProducto;
    
    private String codigoProducto;
    private String nombreProducto;
    private String descripcionProducto;
    private Integer precioProducto;
    private Integer stockProducto;
    private Integer stockCriticoProducto;
    private String categoriaProducto;
    private String imagenProducto;

    
}
