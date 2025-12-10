package com.example.backend.BackEnd.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {

    // Permisos del Administrador 
    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ADMIN_DELETE("admin:delete"),

    // Permisos del Vendedor 
    VENDEDOR_READ("vendedor:read"),
    VENDEDOR_UPDATE("vendedor:update"),
    VENDEDOR_CREATE("vendedor:create"),
    VENDEDOR_DELETE("vendedor:delete"),

    // Permisos del Cliente
    CLIENTE_READ("cliente:read"),
    CLIENTE_CREATE("cliente:create") // Ej: crear un pedido, registrarse
    ;

    @Getter
    private final String permission;
}
