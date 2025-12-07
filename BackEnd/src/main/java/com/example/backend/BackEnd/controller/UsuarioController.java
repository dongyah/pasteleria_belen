package com.example.backend.BackEnd.controller;

import com.example.backend.BackEnd.auth.AuthenticationRequest;
import com.example.backend.BackEnd.model.Orden;
import com.example.backend.BackEnd.model.Usuario;
import com.example.backend.BackEnd.repository.UsuarioRepository;
import com.example.backend.BackEnd.service.UsuarioService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;




@RestController
@RequestMapping("/api/v1/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {
    
    @Autowired
    private UsuarioService UsuarioService;
    @GetMapping("/all")
    public List<Usuario> getAllUsuario() {
        return UsuarioService.getAllUsuarios();
    }
    @PostMapping("/save")
    public Usuario postUsuario(@RequestBody Usuario entity) {        
        return UsuarioService.saveUsuario(entity);
    }
    @GetMapping("/find/{id}")
    public Optional<Usuario> getUsuarioId(@PathVariable Long idUsuario) {
        return UsuarioService.findByIdUsuario(idUsuario);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUsuario(@PathVariable Long idUsuario){
        UsuarioService.deleteUsuario(idUsuario);
    }
    
    @Autowired
    private UsuarioRepository UsuarioRepository;
    @PutMapping("/update/{idUsuario}")
    public Optional<Object> 
        putUsuario(@PathVariable Long idUsuario, @RequestBody Usuario entity) {
        
        return UsuarioRepository.findById(idUsuario)
        .map(existeUsuario->{
            existeUsuario.setNombreUsuario(entity.getNombreUsuario());
            existeUsuario.setApellidosUsuario(entity.getApellidosUsuario());
            existeUsuario.setFechaNacUsuario(entity.getFechaNacUsuario());
            existeUsuario.setRutUsuario(entity.getRutUsuario());
            existeUsuario.setCorreoUsuario(entity.getCorreoUsuario());
            existeUsuario.setTelefonoUsuario(entity.getTelefonoUsuario());
            existeUsuario.setRegionUsuario(entity.getRegionUsuario());
            existeUsuario.setComunaUsuario(entity.getComunaUsuario());
            existeUsuario.setDireccionUsuario(entity.getDireccionUsuario());
            existeUsuario.setPasswordUsuario(entity.getPasswordUsuario());
            existeUsuario.setTipoUsuarioUsuario(entity.getTipoUsuarioUsuario());
            existeUsuario.setCodigoDescuentoUsuario(entity.getCodigoDescuentoUsuario());

            Usuario UsuarioUpdate = UsuarioRepository.save(existeUsuario);
            return UsuarioUpdate;
        });
    }

    @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody AuthenticationRequest authenticationRequest) {
            
            // 1. Buscar usuario por correo (asumo que tienes este método en tu Repositorio)
            Optional<Usuario> usuarioOpt = UsuarioRepository.findByCorreo(authenticationRequest.getCorreo());

            if (usuarioOpt.isEmpty()) {
                // Usuario no encontrado (401 Unauthorized o 404 Not Found)
                return ResponseEntity.status(401).body("Credenciales inválidas.");
            }

            Usuario usuario = usuarioOpt.get();
            
            // 2. Verificar la contraseña
            // SI USAS BCRYPT: if (passwordEncoder.matches(authenticationRequest.getPassword(), usuario.getPassword())) {
            // SI NO USAS BCRYPT (solo para desarrollo/pruebas):
            if (authenticationRequest.getPassword().equals(usuario.getPasswordUsuario())) {
                
                // Éxito: Devolvemos la información del usuario (incluyendo el rol)
                // El frontend usará esta información para guardar la sesión.
                return ResponseEntity.ok(usuario);
            } else {
                // Contraseña incorrecta
                return ResponseEntity.status(401).body("Credenciales inválidas.");
            }
        }

    @GetMapping("/{idUsuario}/historial")
    public ResponseEntity<List<Orden>> getHistorialCompras(@PathVariable Long idUsuario) {
        // Lógica para buscar todas las órdenes relacionadas con ese usuarioId
        List<Orden> historial = OrdenRepository.findByIdUsuarioOrderByFechaCompraDesc(idUsuario);
        return ResponseEntity.ok(historial);
}    
    
    
}


