package com.example.backend.BackEnd.controller;

import com.example.backend.BackEnd.model.Orden;
import com.example.backend.BackEnd.service.OrdenService;
import com.example.backend.BackEnd.dto.OrderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/ordenes")
@RequiredArgsConstructor
public class OrdenController {

    private final OrdenService ordenService;

    // 1. CREAR ORDEN (Desde el Checkout)
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Orden> createOrden(@RequestBody OrderRequest request) {
        try {
            Orden nuevaOrden = ordenService.createOrden(request);
            return new ResponseEntity<>(nuevaOrden, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 2. OBTENER TODAS LAS ÓRDENES
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    @GetMapping("/all")
    public ResponseEntity<List<Orden>> getAllOrdenes() {
        return ResponseEntity.ok(ordenService.getAllOrdenes());
    }

    // 3. OBTENER DETALLE DE ORDEN (Para la boleta)
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    @GetMapping("/find/{idOrden}")
    public ResponseEntity<Orden> getOrdenById(@PathVariable Long idOrden) {
        Optional<Orden> orden = ordenService.getOrdenById(idOrden);
        return orden.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 4. ACTUALIZAR ESTADO DE ORDEN (Ej: Cambiar a 'Enviado')
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    @PutMapping("/estado/{idOrden}")
    public ResponseEntity<Orden> updateEstado(@PathVariable Long idOrden, @RequestBody String nuevoEstado) {
        Optional<Orden> updatedOrden = ordenService.updateEstado(idOrden, nuevoEstado);
        return updatedOrden.map(ResponseEntity::ok)
                           .orElseGet(() -> ResponseEntity.notFound().build());
    }
}