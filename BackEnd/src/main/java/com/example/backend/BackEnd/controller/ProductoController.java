package com.example.backend.BackEnd.controller;

import org.springframework.web.bind.annotation.RestController;
import com.example.backend.BackEnd.model.Producto;
import com.example.backend.BackEnd.repository.ProductoRepository;
import com.example.backend.BackEnd.service.ProductoService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.multipart.MultipartFile; // ⬅️ IMPORTAR PARA MANEJAR ARCHIVOS


@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;

    @Autowired
    private ProductoRepository productoRepository;
    
    // 1. OBTENER TODOS LOS PRODUCTOS (ACCESO PÚBLICO)
    @GetMapping("/all")
    public List<Producto> getAllProducto() {
        return productoService.getAllProductos();
    }

    // 2. CREAR PRODUCTO (ADMIN y VENDEDOR) - ADAPTADO PARA FORM-DATA Y FIX DE SEGURIDAD
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_VENDEDOR')") // ⬅️ FIX A: CORRECCIÓN DE SEGURIDAD
    @PostMapping("/save")
    @ResponseStatus(HttpStatus.CREATED)
    public Producto postProducto(
        // 🔑 FIX B: Recibe la imagen y todos los campos como RequestParam
        @RequestParam(value = "imagen", required = false) MultipartFile imagen, 
        @RequestParam("codigo_producto") String codigo,
        @RequestParam("nombre_producto") String nombre,
        @RequestParam("precio_producto") Double precio,
        @RequestParam("stock_producto") Integer stock,
        @RequestParam(value = "stock_critico_producto", required = false) Integer stockCritico,
        @RequestParam(value = "descripcion_producto", required = false) String descripcion,
        @RequestParam("categoria_id") Long categoriaId
    ) {
        // En un escenario real, productoService.saveProducto debería manejar
        // la búsqueda de la Categoría y el guardado de la imagen.
        
        // El método del servicio debe ser actualizado para coincidir con estos parámetros.
        return productoService.saveProducto(
            imagen, codigo, nombre, precio, stock, stockCritico, descripcion, categoriaId
        );
    }

    // 3. OBTENER DETALLE (ACCESO PÚBLICO)
    @GetMapping("/find/{idProducto}")
    public Optional<Producto> getProductoId(@PathVariable Long idProducto) {
        return productoService.findByIdProducto(idProducto);
    }

    // 4. ELIMINAR PRODUCTO (SOLO ADMIN)
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // ⬅️ FIX A: Seguridad
    @DeleteMapping("/delete/{idProducto}")
    public void deleteProducto(@PathVariable Long idProducto){
        productoService.deleteProducto(idProducto);
    }
    
    // 5. ACTUALIZAR PRODUCTO (ADMIN y VENDEDOR)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_VENDEDOR')") // ⬅️ FIX A: Seguridad
    @PutMapping("/update/{idProducto}")
    public ResponseEntity<Producto> putProducto(@PathVariable Long idProducto, @RequestBody Producto entity) {
        
        Optional<Producto> optionalProducto = productoRepository.findById(idProducto);
        
        if (optionalProducto.isPresent()) {
            Producto existeProducto = optionalProducto.get();
            
            // Aquí debes asegurarte que si usas @RequestBody, la entidad tenga la categoría correcta
            existeProducto.setCodigoProducto(entity.getCodigoProducto());
            existeProducto.setNombreProducto(entity.getNombreProducto());
            existeProducto.setDescripcionProducto(entity.getDescripcionProducto());
            existeProducto.setPrecioProducto(entity.getPrecioProducto());
            existeProducto.setStockProducto(entity.getStockProducto());
            existeProducto.setStockCriticoProducto(entity.getStockCriticoProducto());
            existeProducto.setNombreCategoriaProducto(entity.getNombreCategoriaProducto()); 
            existeProducto.setImagenProducto(entity.getImagenProducto());
            
            Producto productoUpdate = productoRepository.save(existeProducto);
            return ResponseEntity.ok(productoUpdate);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}