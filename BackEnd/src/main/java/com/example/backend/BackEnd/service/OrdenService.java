package com.example.backend.BackEnd.service;

import com.example.backend.BackEnd.model.Orden;
import com.example.backend.BackEnd.model.OrdenProducto;
import com.example.backend.BackEnd.repository.OrdenRepository;
import com.example.backend.BackEnd.repository.OrdenProductoRepository;
import com.example.backend.BackEnd.dto.OrderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdenService {

    private final OrdenRepository ordenRepository;
    @SuppressWarnings("unused")
    private final OrdenProductoRepository ordenProductoRepository;

   
    public List<Orden> getAllOrdenes() {
        return ordenRepository.findAll();
    }


    public Optional<Orden> getOrdenById(Long idOrden) {
        return ordenRepository.findById(idOrden);
    }
    
    
    @Transactional
    public Orden createOrden(OrderRequest orderRequest) {
        
        Orden orden = Orden.builder()
                .usuarioId(orderRequest.getUsuarioId())
                .nombreCliente(orderRequest.getCliente().getNombre() + " " + orderRequest.getCliente().getApellidos())
                .correoCliente(orderRequest.getCliente().getCorreo())
                .direccionEnvio(orderRequest.getCliente().getCalle() + ", " + orderRequest.getCliente().getComuna() + ", " + orderRequest.getCliente().getRegion())
                .indicaciones(orderRequest.getCliente().getIndicaciones())
                .fechaCompra(LocalDateTime.now())
                .total(orderRequest.getTotal().intValue())
                .estado("Pagado - Pendiente de Envío")
                .build();

        List<OrdenProducto> items = orderRequest.getProductos().stream()
            .map(itemDto -> {
                OrdenProducto item = OrdenProducto.builder()
                    .productoId(itemDto.getProductoId())
                    .nombreProducto(itemDto.getProductoNombre())
                    .cantidad(itemDto.getCantidad())
                    .precioUnitario(itemDto.getPrecioUnitario())
                    .build();
                
                item.setOrden(orden); 
                return item;
            })
            .collect(Collectors.toList());

        orden.setItems(items);
        
        Orden ordenGuardada = ordenRepository.save(orden);
        
        return ordenGuardada;
    }


    public Optional<Orden> updateEstado(Long idOrden, String nuevoEstado) {
        return ordenRepository.findById(idOrden).map(orden -> {
            orden.setEstado(nuevoEstado);
            return ordenRepository.save(orden);
        });
    }
}