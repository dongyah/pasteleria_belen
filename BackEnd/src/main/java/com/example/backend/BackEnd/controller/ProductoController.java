package com.example.backend.BackEnd.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.backend.BackEnd.model.Producto;
import com.example.backend.BackEnd.repository.ProductoRepository;
import com.example.backend.BackEnd.service.ProductoService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    @GetMapping("/all")
    public List<Producto> getAllProducto() {
        return productoService.getAllProductos();
    }
    @PostMapping("/save")
    public Producto postProducto(@RequestBody Producto entity) {        
        return productoService.saveProducto(entity);
    }
    @GetMapping("/find/{idProducto}")
    public Optional<Producto> getProductoId(@PathVariable Long idProducto) {
        return productoService.findByIdProducto(idProducto);
    }

    @DeleteMapping("/delete/{idProducto}")
    public void deleteProducto(@PathVariable Long idProducto){
        productoService.deleteProducto(idProducto);
    }
    
    @Autowired
    private ProductoRepository productoRepository;
    @PutMapping("/update/{idProducto}")
    public Optional<Object> 
        putProducto(@PathVariable Long idProducto, @RequestBody Producto entity) {
        
        return productoRepository.findById(idProducto)
        .map(existeProducto->{
            existeProducto.setCodigoProducto(entity.getCodigoProducto());
            existeProducto.setNombreProducto(entity.getNombreProducto());
            existeProducto.setDescripcionProducto(entity.getDescripcionProducto());
            existeProducto.setPrecioProducto(entity.getPrecioProducto());
            existeProducto.setStockProducto(entity.getStockProducto());
            existeProducto.setStockCriticoProducto(entity.getStockCriticoProducto());
            existeProducto.setCategoriaProducto(entity.getCategoriaProducto());
            existeProducto.setImagenProducto(entity.getImagenProducto());
            Producto productoUpdate = productoRepository.save(existeProducto);
            return productoUpdate;
        });
    }

    
    
}


