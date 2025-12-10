package com.example.backend.BackEnd.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public enum Role {

    // 1. Rol CLIENTE
    CLIENTE(
            Set.of(
                    Permission.CLIENTE_READ,
                    Permission.CLIENTE_CREATE
            )
    ),

    // 2. Rol VENDEDOR
    VENDEDOR(
            Set.of(
                    Permission.VENDEDOR_READ,
                    Permission.VENDEDOR_UPDATE,
                    Permission.VENDEDOR_CREATE,
                    Permission.VENDEDOR_DELETE,
                    Permission.CLIENTE_READ // Podría necesitar ver la lista de clientes
            )
    ),

    // 3. Rol ADMINISTRADOR
    ADMIN(
            Set.of(
                    Permission.ADMIN_READ,
                    Permission.ADMIN_UPDATE,
                    Permission.ADMIN_CREATE,
                    Permission.ADMIN_DELETE,
                    Permission.VENDEDOR_READ,
                    Permission.VENDEDOR_UPDATE,
                    Permission.VENDEDOR_CREATE,
                    Permission.VENDEDOR_DELETE,
                    Permission.CLIENTE_READ,
                    Permission.CLIENTE_CREATE
            )
    )
    ;

    @Getter
    private final Set<Permission> permissions;

    
    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());

      
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
