package com.example.backend.BackEnd.controller;

import com.example.backend.BackEnd.auth.AuthenticationRequest;
import com.example.backend.BackEnd.auth.AuthenticationResponse; 
import com.example.backend.BackEnd.auth.RegisterRequest; 
import com.example.backend.BackEnd.model.Orden;
import com.example.backend.BackEnd.model.Usuario;
import com.example.backend.BackEnd.repository.UsuarioRepository;
import com.example.backend.BackEnd.service.UsuarioService;
import com.example.backend.BackEnd.repository.OrdenRepository;
import com.example.backend.BackEnd.auth.AuthenticationService; 

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional; 
import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/api/v1/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {
    
    
    @Autowired private OrdenRepository ordenRepository;
    @Autowired private UsuarioService usuarioService; 
    @Autowired private UsuarioRepository usuarioRepository; 
    @Autowired private AuthenticationService authenticationService; 


    // --- 1. REGISTRO DE USUARIO (ACCESO PÚBLICO) ---
    @PostMapping("/save")
    public ResponseEntity<AuthenticationResponse> postUsuario(@RequestBody RegisterRequest request) { 
        AuthenticationResponse response = authenticationService.register(request);
        return ResponseEntity.ok(response);
    }
    
    
    // --- 2. LOGIN / AUTENTICACIÓN (ACCESO PÚBLICO) ---
    @PostMapping("/login") 
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest authenticationRequest) {
        try {
            AuthenticationResponse response = authenticationService.authenticate(authenticationRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas.");
        }
    }


    // --- 3. MÉTODOS CRUD ESTÁNDAR (SÓLO ADMIN) ---
    @PreAuthorize("hasRole('ADMIN')") 
    @GetMapping("/all")
    public List<Usuario> getAllUsuario() {
        return usuarioService.getAllUsuarios();
    }
    
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')") 
    @GetMapping("/find/{idUsuario}") 
    public Optional<Usuario> getUsuarioId(@PathVariable Long idUsuario) {
        return usuarioService.findByIdUsuario(idUsuario);
    }

    @PreAuthorize("hasRole('ADMIN')") 
    @DeleteMapping("/delete/{idUsuario}") 
    public void deleteUsuario(@PathVariable Long idUsuario){
        usuarioService.deleteUsuario(idUsuario);
    }
    
    // --- 4. ACTUALIZACIÓN (PUT) (ADMIN y VENDEDOR) ---
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')") 
    @PutMapping("/update/{idUsuario}")
    @Transactional 
    public ResponseEntity<Usuario> putUsuario(@PathVariable Long idUsuario, @RequestBody Usuario entity) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUsuario);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build(); 
        }
        
        Usuario existeUsuario = usuarioOpt.get();
        
        existeUsuario.setNombreUsuario(entity.getNombreUsuario());
        existeUsuario.setApellidosUsuario(entity.getApellidosUsuario());
        existeUsuario.setFechaNacUsuario(entity.getFechaNacUsuario());
        existeUsuario.setRutUsuario(entity.getRutUsuario());
        existeUsuario.setCorreoUsuario(entity.getCorreoUsuario());
        existeUsuario.setTelefonoUsuario(entity.getTelefonoUsuario());
        existeUsuario.setRegionUsuario(entity.getRegionUsuario());
        existeUsuario.setComunaUsuario(entity.getComunaUsuario());
        existeUsuario.setDireccionUsuario(entity.getDireccionUsuario());
        
        if (entity.getPasswordUsuario() != null && !entity.getPasswordUsuario().isEmpty()) {
             existeUsuario.setPasswordUsuario(entity.getPasswordUsuario());
        } else {
             existeUsuario.setPasswordUsuario(existeUsuario.getPasswordUsuario()); 
        }

        existeUsuario.setTipoUsuarioUsuario(entity.getTipoUsuarioUsuario());
        existeUsuario.setCodigoDescuentoUsuario(entity.getCodigoDescuentoUsuario());

        try {
            Usuario usuarioUpdate = usuarioRepository.save(existeUsuario);
            return ResponseEntity.ok(usuarioUpdate); 
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); 
        }
    }


    // --- 5. HISTORIAL DE COMPRAS (Ruta Protegida - VENDEDOR y ADMIN) ---
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    @GetMapping("/{idUsuario}/historial")
    public ResponseEntity<List<Orden>> getHistorialCompras(@PathVariable Long idUsuario) {
        
        List<Orden> historial = ordenRepository.findByUsuarioIdOrderByFechaCompraDesc(idUsuario); 
        
        return ResponseEntity.ok(historial);
    } 
}