package com.example.backend.BackEnd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.BackEnd.model.Categoria;
import com.example.backend.BackEnd.repository.CategoriaRepository;


@Service
public class CategoriaService {
    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    public Categoria saveCategoria(Categoria categoria) {
        categoria.setIdCategoria(null);
        return categoriaRepository.save(categoria);
    }

    public Optional<Categoria> findByIdCategoria(Long idCategoria) {
        return categoriaRepository.findById(idCategoria);
    }

    public void deleteCategoria(Long idCategoria) {
        categoriaRepository.deleteById(idCategoria);
    }
    
}
