package com.example.backend.BackEnd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile; // Necesario para manejar la imagen

import com.example.backend.BackEnd.model.Categoria;
import com.example.backend.BackEnd.model.Producto;
import com.example.backend.BackEnd.repository.ProductoRepository;
import com.example.backend.BackEnd.repository.CategoriaRepository; // ⬅️ Necesitas inyectar el repositorio de Categoría

import jakarta.transaction.Transactional; // Necesario si manejas lógica compleja con repositorios

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private CategoriaRepository categoriaRepository; // ⬅️ Asumo que tienes un repositorio para categorías

    // Este es el método original para el listado, se mantiene.
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    /**
     * Guarda un nuevo producto, gestionando la categoría y la imagen.
     * Este método reemplaza el saveProducto(Producto prod) original.
     */
    @Transactional
    public Producto saveProducto(
        MultipartFile imagen, 
        String codigo,
        String nombre,
        Double precio,
        Integer stock,
        Integer stockCritico,
        String descripcion,
        Long categoriaId // ID de la categoría
    ) {
        // 1. Manejar la Carga de la Imagen (Simulación)
        // En un proyecto real, aquí guardarías 'imagen' en un servidor de archivos (AWS S3, Google Cloud, o local)
        // y obtendrías la URL.
        String imagenUrl = "URL_temporal_o_defecto/" + nombre.replaceAll("\\s+", "_");

        // 2. Validar que la Categoría exista
        if (!categoriaRepository.existsById(categoriaId)) {
            throw new RuntimeException("Categoría no encontrada con ID: " + categoriaId);
        }
        
        // 3. Construir la Entidad Producto
        Producto nuevoProducto = new Producto();
        
        // Si el ID es autogenerado, no se setea (dejarlo en null o no setearlo)
        // nuevoProducto.setIdProducto(null); 
        
        nuevoProducto.setCodigoProducto(codigo);
        nuevoProducto.setNombreProducto(nombre);
        nuevoProducto.setPrecioProducto(precio.intValue()); // Convertir Double a Integer
        nuevoProducto.setStockProducto(stock);
        nuevoProducto.setStockCriticoProducto(stockCritico);
        nuevoProducto.setDescripcionProducto(descripcion);
        nuevoProducto.setImagenProducto(imagenUrl); // Asignar la URL de la imagen
        // Buscar el nombre de la categoría por ID
        String nombreCategoria = categoriaRepository.findById(categoriaId)
            .map(Categoria::getNombreCategoria)
            .orElse("Categoría desconocida");
        nuevoProducto.setNombreCategoriaProducto(nombreCategoria); // Asignar el nombre de la categoría como String

        // 4. Guardar y devolver
        return productoRepository.save(nuevoProducto);
    }
    
    // Este método ya no es usado por el Controller postProducto, pero se deja por si lo usas en otro lado.
    // public Producto saveProducto(Producto prod) {
    //     prod.setIdProducto(null);
    //     return productoRepository.save(prod);
    // }

    public Optional<Producto> findByIdProducto(Long idProducto) {
        return productoRepository.findById(idProducto);
    }

    public void deleteProducto(Long idProducto) {
        productoRepository.deleteById(idProducto);
    }
    
}