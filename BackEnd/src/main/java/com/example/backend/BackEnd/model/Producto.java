package com.example.backend.BackEnd.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table; // Es buena práctica definir el nombre de la tabla
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "producto")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProducto;
    
    // --- Campos del Producto ---
    private String codigoProducto;
    private String nombreProducto;
    private String descripcionProducto;
    private Integer precioProducto;
    private Integer stockProducto;
    private Integer stockCriticoProducto;
    
    // Campo para la URL/Ruta de la imagen
    private String imagenProducto; 

    // 🔑 CAMBIO CRÍTICO: ALMACENAR EL NOMBRE DE LA CATEGORÍA COMO STRING
    // Esto reemplaza la relación @ManyToOne con la entidad Categoria
    @Column(name = "nombre_categoria_producto")
    private String nombreCategoriaProducto;


}