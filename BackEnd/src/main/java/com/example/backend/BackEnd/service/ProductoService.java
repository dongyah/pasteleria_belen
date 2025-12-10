package com.example.backend.BackEnd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.BackEnd.model.Categoria;
import com.example.backend.BackEnd.model.Producto;
import com.example.backend.BackEnd.repository.ProductoRepository;
import com.example.backend.BackEnd.repository.CategoriaRepository;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired 
    private CategoriaRepository categoriaRepository; 

    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }
    
    public Optional<Producto> findByIdProducto(Long idProducto) {
        return productoRepository.findById(idProducto);
    }

    public void deleteProducto(Long idProducto) {
        productoRepository.deleteById(idProducto);
    }

    @Transactional
    public Producto saveProducto(
        MultipartFile imagen, 
        String codigo,
        String nombre,
        Double precio,
        Integer stock,
        Integer stockCritico,
        String descripcion,
        String nombreCategoria
    ) {
        categoriaRepository.findByNombreCategoria(nombreCategoria)
            .orElseThrow(() -> new RuntimeException("Error: Categoría no encontrada: " + nombreCategoria));

        String imagenUrl;
        if (imagen != null && !imagen.isEmpty()) {
            imagenUrl = "URL_REAL_DE_LA_IMAGEN/" + imagen.getOriginalFilename();
        } else {
            imagenUrl = "URL_temporal_o_defecto/placeholder.png";
        }

        Producto nuevoProducto = new Producto();
        nuevoProducto.setCodigoProducto(codigo);
        nuevoProducto.setNombreProducto(nombre);
        nuevoProducto.setPrecioProducto(precio.intValue());
        nuevoProducto.setStockProducto(stock);
        nuevoProducto.setStockCriticoProducto(stockCritico != null ? stockCritico : 0); 
        nuevoProducto.setDescripcionProducto(descripcion);
        nuevoProducto.setImagenProducto(imagenUrl);
        nuevoProducto.setNombreCategoriaProducto(nombreCategoria); 

        return productoRepository.save(nuevoProducto);
    }
    
}