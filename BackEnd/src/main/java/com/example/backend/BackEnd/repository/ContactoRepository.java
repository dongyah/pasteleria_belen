package com.example.backend.BackEnd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.BackEnd.model.Contacto;

public interface ContactoRepository extends JpaRepository<Contacto, Long>  {
    
}
