package com.example.backend.BackEnd.controller;

import com.example.backend.BackEnd.model.Categoria;
import com.example.backend.BackEnd.repository.CategoriaRepository;
import com.example.backend.BackEnd.service.CategoriaService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // ⬅️ IMPORTAR
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaController {
    
    @Autowired
    private CategoriaService CategoriaService;
    
    @Autowired
    private CategoriaRepository CategoriaRepository; // Mantenerlo aquí, aunque es mejor inyectar solo en el constructor (Lombok)

    // --- RUTAS PÚBLICAS (Catálogo) ---
    // El listado general de categorías debe ser accesible por cualquiera (para la tienda)
    @GetMapping("/all")
    public List<Categoria> getAllCategoria() {
        return CategoriaService.getAllCategorias();
    }
    
    // El método search también es probablemente público para el filtrado en la tienda
    @GetMapping("/search") 
    public ResponseEntity<Categoria> getByNombrePath(@RequestParam String nombreCategoria) {
        Optional<Categoria> categoria = CategoriaRepository.findByNombreCategoria(nombreCategoria);
        return categoria.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // --- RUTAS PROTEGIDAS (ADMIN/VENDEDOR) ---
    
    // 1. GUARDAR / CREAR
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_VENDEDOR')") // ⬅️ FIX: Protección con Authorities
    @PostMapping("/save")
    @ResponseStatus(HttpStatus.CREATED)
    public Categoria postCategoria(@RequestBody Categoria entity) { 
        return CategoriaService.saveCategoria(entity);
    }
    
    // 2. BUSCAR POR ID (Necesario para Admin_EditarCategoria.jsx)
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_VENDEDOR')") // ⬅️ FIX: Protección con Authorities
    @GetMapping("/find/{idCategoria}")
    public ResponseEntity<Categoria> getCategoriaId(@PathVariable Long idCategoria) {
        // Se cambia el retorno a ResponseEntity para manejar el 404
        Optional<Categoria> categoria = CategoriaService.findByIdCategoria(idCategoria);
        return categoria.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 3. ELIMINAR
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // ⬅️ FIX: Solo ADMIN debe eliminar
    @DeleteMapping("/delete/{idCategoria}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // ⬅️ Buen código de respuesta para DELETE
    public void deleteCategoria(@PathVariable Long idCategoria){
        CategoriaService.deleteCategoria(idCategoria);
    }
    
    // 4. ACTUALIZAR
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_VENDEDOR')") // ⬅️ FIX: Protección con Authorities
    @PutMapping("/update/{idCategoria}")
    public ResponseEntity<Categoria> putCategoria(@PathVariable Long idCategoria, @RequestBody Categoria entity) {
        
        Optional<Categoria> optionalCategoria = CategoriaRepository.findById(idCategoria);
        
        if (optionalCategoria.isPresent()) {
            Categoria existeCategoria = optionalCategoria.get();
            
            // Actualizar campos
            existeCategoria.setNombreCategoria(entity.getNombreCategoria());

            Categoria CategoriaUpdate = CategoriaRepository.save(existeCategoria);
            return ResponseEntity.ok(CategoriaUpdate);
        } else {
            return ResponseEntity.notFound().build(); // Devuelve 404 si no existe
        }
    }
}