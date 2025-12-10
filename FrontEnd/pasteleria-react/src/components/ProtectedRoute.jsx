import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    // 1. Obtener los datos de autenticación del almacenamiento local
    const isAuthenticated = localStorage.getItem('jwtToken');
    const userRole = localStorage.getItem('userRole'); // Ej: "ADMIN" o "CLIENTE"

    // Si no está autenticado, siempre redirigir a login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. Verificar el Rol
    // Si el rol del usuario NO está en la lista de roles permitidos
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirigir a una página de inicio o de error 403 (Acceso Denegado)
        // Usamos '/' como ruta por defecto de acceso denegado
        return <Navigate to="/" replace />;
    }

    // Si está autenticado y el rol es correcto, renderizar las rutas anidadas
    return <Outlet />;
};

export default ProtectedRoute;