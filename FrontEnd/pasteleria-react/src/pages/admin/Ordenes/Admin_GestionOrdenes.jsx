import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Admin_BarraLateral from '../Admin_BarraLateral'; 
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../../styles/Admin.css';
import '../../../styles/Admin_Gestion.css'; 

const API_BASE_URL = 'http://localhost:8015/api/v1'; 

function Admin_GestionOrdenes() {
    const navigate = useNavigate();
    const [ordenes, setOrdenes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrdenes = async () => {
        setCargando(true);
        setError(null);
        
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            // Llamada protegida a GET /api/v1/ordenes/all
            const response = await axios.get(`${API_BASE_URL}/ordenes/all`, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            
            // 🔑 FIX CRÍTICO: Verificar que la respuesta sea un array. 
            // Esto evita el error "ordenes.map is not a function"
            if (Array.isArray(response.data)) {
                setOrdenes(response.data); 
            } else {
                console.warn("El backend no devolvió un array para órdenes. Resultado:", response.data);
                setOrdenes([]); // Asignamos un array vacío para evitar el crash
            }

        } catch (err) {
            console.error("Error al cargar órdenes:", err.response || err);
            
            let errorMsg = "Error al cargar órdenes. Verifique el servidor y permisos.";
            
            if (err.response && (err.response.status === 403 || err.response.status === 401)) {
                 errorMsg = "Acceso denegado (403/401). Su usuario no tiene el rol ADMIN o VENDEDOR.";
            } else if (err.response && err.response.status === 404) {
                 errorMsg = "Error 404: La ruta /api/v1/ordenes/all no está definida correctamente en el backend.";
            }
            
            Swal.fire('Error de Carga', errorMsg, 'error');
            setError(errorMsg); 
        } finally {
            setCargando(false);
        }
    };
    
    useEffect(() => {
        fetchOrdenes();
    }, []); 
    
    // Función para formatear fechas
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-CL', options);
    };

    // Función para determinar el color de la etiqueta de estado
    const getBadgeClass = (estado) => {
        if (estado.includes('Envío')) return 'bg-warning text-dark';
        if (estado.includes('Entregado')) return 'bg-success';
        if (estado.includes('Cancelada')) return 'bg-danger';
        return 'bg-secondary';
    };


    if (cargando) {
        return (
            <div className="admin-layout">
                <Admin_BarraLateral />
                <div className="contenido-principal"><p className="text-center mt-5">Cargando órdenes...</p></div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="admin-layout">
                <Admin_BarraLateral />
                <div className="contenido-principal"><p className="text-center mt-5 text-danger">Error: {error} 🙁</p></div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <Admin_BarraLateral />
            <div className="contenido-principal">
                <main className="admin-contenido p-4">
                    <div className="card shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Gestión de Órdenes ({ordenes.length} Encontradas)</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="text-center">ID Orden</th>
                                            <th scope="col">Fecha</th>
                                            <th scope="col">Cliente</th>
                                            <th scope="col">Total</th>
                                            <th scope="col">Estado</th>
                                            <th scope="col" className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Renderizado seguro: Garantiza que solo se mapee si es un array no vacío */}
                                        {Array.isArray(ordenes) && ordenes.length > 0 ? ( 
                                            ordenes.map(orden => (
                                                <tr key={orden.idOrden}> 
                                                    <td className="text-center">{orden.idOrden}</td>
                                                    <td>{formatDate(orden.fechaCompra)}</td>
                                                    <td>{orden.nombreCliente || 'Anónimo'}</td> 
                                                    <td>${(orden.total || 0).toLocaleString()} CLP</td>
                                                    <td><span className={`badge ${getBadgeClass(orden.estado)}`}>{orden.estado}</span></td>
                                                    <td className="text-center">
                                                        <Link to={`/admin/ordenes/${orden.idOrden}`} className="btn btn-sm btn-info me-2">Ver Boleta</Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center text-muted">No hay órdenes registradas.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Admin_GestionOrdenes;