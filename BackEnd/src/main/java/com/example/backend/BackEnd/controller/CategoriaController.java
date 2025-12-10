package com.example.backend.BackEnd.controller;

import com.example.backend.BackEnd.model.Categoria;
import com.example.backend.BackEnd.repository.CategoriaRepository;
import com.example.backend.BackEnd.service.CategoriaService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaController {
    
    @Autowired
    private CategoriaService CategoriaService;
    
    @Autowired
    private CategoriaRepository CategoriaRepository;

    @GetMapping("/all")
    public List<Categoria> getAllCategoria() {
        return CategoriaService.getAllCategorias();
    }
    
    @GetMapping("/search") 
    public ResponseEntity<Categoria> getByNombrePath(@RequestParam String nombreCategoria) {
        Optional<Categoria> categoria = CategoriaRepository.findByNombreCategoria(nombreCategoria);
        return categoria.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_VENDEDOR')")
    @PostMapping("/save")
    @ResponseStatus(HttpStatus.CREATED)
    public Categoria postCategoria(@RequestBody Categoria entity) { 
        return CategoriaService.saveCategoria(entity);
    }
    
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_VENDEDOR')")
    @GetMapping("/find/{idCategoria}")
    public ResponseEntity<Categoria> getCategoriaId(@PathVariable Long idCategoria) {
        Optional<Categoria> categoria = CategoriaService.findByIdCategoria(idCategoria);
        return categoria.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/delete/{idCategoria}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategoria(@PathVariable Long idCategoria){
        CategoriaService.deleteCategoria(idCategoria);
    }
    
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_VENDEDOR')")
    @PutMapping("/update/{idCategoria}")
    public ResponseEntity<Categoria> putCategoria(@PathVariable Long idCategoria, @RequestBody Categoria entity) {
        
        Optional<Categoria> optionalCategoria = CategoriaRepository.findById(idCategoria);
        
        if (optionalCategoria.isPresent()) {
            Categoria existeCategoria = optionalCategoria.get();
            
            existeCategoria.setNombreCategoria(entity.getNombreCategoria());

            Categoria CategoriaUpdate = CategoriaRepository.save(existeCategoria);
            return ResponseEntity.ok(CategoriaUpdate);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}