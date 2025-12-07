package com.example.backend.BackEnd.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "ordenes_compra")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Orden {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // CLAVE: Relación con la tabla Usuario (Historial)
    // Indica qué usuario realizó la compra (si estaba logueado)
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario; 

    private String codigoBoleta; // ORDERXXXXXX
    private LocalDateTime fechaCompra;
    private String estado; // Pendiente, Enviado, Entregado, Cancelado
    private double total;

    // Datos de Envío (pueden ser diferentes a los del Usuario)
    private String nombreReceptor;
    private String apellidoReceptor;
    private String rutReceptor;
    private String correoReceptor;
    private String telefonoReceptor;
    private String regionEnvio;
    private String comunaEnvio;
    private String direccionEnvio;


    // Relación con los detalles de los productos comprados
    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleOrden> detalles = new ArrayList<>();
}
