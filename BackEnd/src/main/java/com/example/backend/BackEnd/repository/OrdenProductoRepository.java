package com.example.backend.BackEnd.repository;

import com.example.backend.BackEnd.model.OrdenProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdenProductoRepository extends JpaRepository<OrdenProducto, Long> {
}