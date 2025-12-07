package com.example.backend.BackEnd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.BackEnd.model.Producto;
import com.example.backend.BackEnd.repository.ProductoRepository;


@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    public Producto saveProducto(Producto prod) {
        prod.setIdProducto(null);
        return productoRepository.save(prod);
    }
    
    public Optional<Producto> findByIdProducto(Long idProducto) {
        return productoRepository.findById(idProducto);
    }

    public void deleteProducto(Long idProducto) {
        productoRepository.deleteById(idProducto);
    }
    
}
