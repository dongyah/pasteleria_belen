package com.example.backend.BackEnd.controller;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.BackEnd.model.Orden;

public interface OrdenRepository extends JpaRepository<Orden, Long> {

    List<Orden> findByIdUsuarioOrderByFechaCompraDesc(Long idUsuario);
    
    /**
     * Opcional: Buscar una orden por su código de boleta.
     */
    Orden findByCodigoBoleta(String codigoBoleta);

    
}
