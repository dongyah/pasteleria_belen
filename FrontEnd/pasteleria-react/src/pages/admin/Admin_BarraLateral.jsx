import React from 'react';
import '../../styles/Admin.css';
import '../../styles/fontello.css';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Añadimos useLocation y useNavigate

function Admin_BarraLateral() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // 🔑 OBTENER EL ROL Y EL NOMBRE DE USUARIO DESDE LOCALSTORAGE
    const userRole = localStorage.getItem('userRole'); // Ej: 'ADMIN', 'VENDEDOR'
    const usuarioActualJSON = localStorage.getItem('usuarioActual');
    
    // Intenta parsear el nombre, si no existe usa 'ADMIN'/'VENDEDOR'
    let userName = userRole || 'USUARIO';
    if (usuarioActualJSON) {
        try {
            const userData = JSON.parse(usuarioActualJSON);
            userName = userData.nombre || userRole || 'USUARIO';
        } catch (e) {
            // Manejar error de parseo si es necesario
        }
    }
    
    // Lógica de Permisos
    const isAdmin = userRole === 'ADMIN';
    const isVendedor = userRole === 'VENDEDOR' || isAdmin; // Vendedor incluye Admin

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        localStorage.clear(); // Elimina token, rol y datos de usuario
        navigate('/login');
    };

    // Función auxiliar para saber si una ruta está activa
    const isActive = (path) => location.pathname === path || (path === '/admin' && location.pathname === '/');

    return (
        <aside className="barra-lateral">
            <div className="barra-superior">
                <div className="logotipo">
                    <img src="/img/logo_pasteleria.png" alt="Logo Pastelería" />
                </div>
                <nav>
                    <ul>
                        {/* 1. INICIO (Siempre accesible) */}
                        <li>
                            <Link to="/admin" className={isActive('/admin') ? 'active-link' : ''}>
                                <i className="icon-home"></i> Inicio
                            </Link>
                        </li>

                        {/* 2. ÓRDENES (ADMIN y VENDEDOR) */}
                        {isVendedor && (
                            <li>
                                <Link to="/admin/ordenes" className={isActive('/admin/ordenes') ? 'active-link' : ''}>
                                    <i className="icon-clipboard"></i> Órdenes
                                </Link>
                            </li>
                        )}
                        
                        {/* 3. PRODUCTOS (ADMIN y VENDEDOR) */}
                        {isVendedor && (
                            <li>
                                <Link to="/admin/productos" className={isActive('/admin/productos') ? 'active-link' : ''}>
                                    <i className="icon-birthday"></i> Productos
                                </Link>
                            </li>
                        )}
                        
                        {/* 4. CATEGORÍAS (ADMIN y VENDEDOR, ya que gestionan productos) */}
                        {isVendedor && (
                            <li>
                                <Link to="/admin/categorias" className={isActive('/admin/categorias') ? 'active-link' : ''}>
                                    <i className="icon-clipboard"></i> Categorías
                                </Link>
                            </li>
                        )}

                        {/* 5. USUARIOS (SOLO ADMIN) */}
                        {isAdmin && (
                            <li>
                                <Link to="/admin/usuarios" className={isActive('/admin/usuarios') ? 'active-link' : ''}>
                                    <i className="icon-users"></i> Usuarios
                                </Link>
                            </li>
                        )}
                        
                        {/* 6. REPORTES (SOLO ADMIN) */}
                        {isAdmin && (
                            <li>
                                <Link to="/admin/reportes" className={isActive('/admin/reportes') ? 'active-link' : ''}>
                                    <i className="icon-chart-bar"></i> Reportes
                                </Link>
                            </li>
                        )}

                        {/* 7. TIENDA (Siempre accesible para ir a la vista pública) */}
                        <li><Link to="/"><i className="icon-shop"></i> Tienda</Link></li>
                    </ul>
                </nav>
            </div>

            <div className="barra-pie">
                <ul>
                    {/* 1. PERFIL (ADMIN y VENDEDOR) */}
                    {isVendedor && (
                        <li>
                            <Link to="/admin/perfil" className={isActive('/admin/perfil') ? 'active-link' : ''}>
                                <i className="icon-user"></i> Perfil
                            </Link>
                        </li>
                    )}
                    
                    {/* 2. CONFIGURACIÓN y BUSCAR/AYUDA (Se mantienen como placeholders) */}
                    <li><a href="#"><i className="icon-cog-outline"></i> Configuración</a></li>
                    <li><a href="#"><i className="icon-search"></i> Buscar</a></li>
                    <li><a href="#"><i className="icon-help-circled-alt"></i> Ayuda</a></li>

                    {/* 3. INFO DE ROL Y LOGOUT */}
                    <li className="user-info-display">
                        <i className="icon-user-circle"></i> {userName} ({userRole})
                    </li>
                    <li>
                        <a href="#" onClick={handleLogout} className="logout-btn">
                            <i className="icon-logout"></i> Cerrar Sesión
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    );
}

export default Admin_BarraLateral;