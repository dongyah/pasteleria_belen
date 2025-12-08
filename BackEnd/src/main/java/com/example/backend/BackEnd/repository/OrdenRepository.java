package com.example.backend.BackEnd.repository;

import com.example.backend.BackEnd.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {

    // Método que busca en la entidad Orden por el ID del usuario
    @Query("SELECT o FROM Orden o WHERE o.idUsuario.idUsuario = :idUsuario ORDER BY o.fechaCompra DESC")
    List<Orden> findByIdUsuarioOrderByFechaCompraDesc(@Param("idUsuario") Long idUsuario); 

    Optional<Orden> findByCodigoBoleta(String codigoBoleta);
}