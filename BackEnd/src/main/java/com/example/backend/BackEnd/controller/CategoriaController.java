package com.example.backend.BackEnd.controller;

import com.example.backend.BackEnd.model.Categoria;
import com.example.backend.BackEnd.repository.CategoriaRepository;
import com.example.backend.BackEnd.service.CategoriaService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaController {
    
    @Autowired
    private CategoriaService CategoriaService;
    @GetMapping("/all")
    public List<Categoria> getAllCategoria() {
        return CategoriaService.getAllCategorias();
    }
    @PostMapping("/save")
    public Categoria postCategoria(@RequestBody Categoria entity) {        
        return CategoriaService.saveCategoria(entity);
    }
    @GetMapping("/find/{idCategoria}")
    public Optional<Categoria> getCategoriaId(@PathVariable Long idCategoria) {
        return CategoriaService.findByIdCategoria(idCategoria);
    }

    @DeleteMapping("/delete/{idCategoria}")
    public void deleteCategoria(@PathVariable Long idCategoria){
        CategoriaService.deleteCategoria(idCategoria);
    }
    
    @Autowired
    private CategoriaRepository CategoriaRepository;
    @PutMapping("/update/{idCategoria}")
    public Optional<Object> 
        putCategoria(@PathVariable Long idCategoria, @RequestBody Categoria entity) {
        
        return CategoriaRepository.findById(idCategoria)
        .map(existeCategoria->{
            existeCategoria.setNombreCategoria(entity.getNombreCategoria());

            Categoria CategoriaUpdate = CategoriaRepository.save(existeCategoria);
            return CategoriaUpdate;
        });
    }

    @GetMapping("/search") 
    public ResponseEntity<Categoria> getByNombrePath(@RequestParam String nombreCategoria) {
        
        Optional<Categoria> categoria = CategoriaRepository.findByNombreCategoria(nombreCategoria);
        
        return categoria.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
}


