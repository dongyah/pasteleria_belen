import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Admin_BarraLateral from '../Admin_BarraLateral'; 
import axios from 'axios';
import '../../../styles/Admin.css';
import '../../../styles/Admin_Gestion.css';
import Swal from 'sweetalert2'; 

const API_BASE_URL = 'http://localhost:8015/api/v1'; 

function Admin_GestionUsuarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false); 

    useEffect(() => {
        if (!window.Swal) {
            const swalScript = document.createElement("script");
            swalScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
            swalScript.async = true;
            document.body.appendChild(swalScript);
            swalScript.onload = () => setIsScriptLoaded(true);
        } else {
            setIsScriptLoaded(true);
        }
    }, []); 

    const fetchUsuarios = async () => {
        setCargando(true);
        setError(null);
        
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            setError("Error: Token de sesión no encontrado. Reintente el login.");
            setCargando(false);
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/usuarios/all`, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            setUsuarios(response.data);
            
        } catch (err) {
            console.error("Error al cargar usuarios:", err.response || err);
            
            let errorMsg = "Error al conectar con el servidor o cargar usuarios. Revise CORS y la ruta.";
            
            if (err.response && (err.response.status === 403 || err.response.status === 401)) {
                 errorMsg = "Error 403: Acceso denegado. El token es inválido o el usuario no tiene rol ADMIN.";
            } else if (err.response && err.response.status === 404) {
                 errorMsg = "Error 404: La ruta de la API no fue encontrada.";
            }
            
            if (isScriptLoaded && window.Swal) {
                window.Swal.fire('Error de Carga', errorMsg, 'error');
            } else {
                setError(errorMsg); 
            }
        } finally {
            setCargando(false);
        }
    };
    
    // Ejecutar la carga de usuarios solo cuando Swal está listo (y la app está montada)
    useEffect(() => {
        if (isScriptLoaded) {
            fetchUsuarios(); 
        }
    }, [isScriptLoaded]); 
    
    // Función para manejar la eliminación de un usuario (DELETE)
    const handleDelete = async (idUsuario) => {
        if (!isScriptLoaded || !window.Swal) {
            console.error('SweetAlert2 no está cargado.');
            window.alert('Error al intentar eliminar: Herramienta de confirmación no disponible.');
            return;
        }
        
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            window.Swal.fire('Error', 'Debe iniciar sesión para realizar esta acción.', 'error');
            return;
        }

        // Confirmación con SweetAlert2
        const result = await window.Swal.fire({
            title: '¿Estás seguro?',
            text: `Se eliminará al usuario con ID ${idUsuario}. ¡Esta acción es irreversible!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡Eliminar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                // Llamada DELETE con el TOKEN
                await axios.delete(`${API_BASE_URL}/usuarios/delete/${idUsuario}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                }); 
                
                // Actualización de estado y mensaje de éxito
                setUsuarios(usuarios.filter(u => (u.id || u.idUsuario) !== idUsuario));
                window.Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado correctamente.', 'success');

            } catch (err) {
                console.error("Error al eliminar:", err.response || err);
                let errorMsg = 'Error al intentar eliminar el usuario. Verifique permisos o dependencias.';
                window.Swal.fire('Error', errorMsg, 'error');
            }
        }
    };
    
    // Helper para obtener el ID de la entidad
    const getUsuarioId = (usuario) => usuario.id || usuario.idUsuario;

    if (cargando) {
        return (
            <div className="admin-layout">
                <Admin_BarraLateral />
                <div className="contenido-principal"><p className="text-center mt-5">Cargando usuarios desde el Backend...</p></div>
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
                            <h5 className="mb-0">Gestión de Usuarios ({usuarios.length} Registrados)</h5>
                            <Link to="/admin/nuevo-usuario" className="btn btn-primary">Nuevo Usuario</Link>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="text-center">ID</th>
                                            <th scope="col">Nombre</th>
                                            <th scope="col">Apellidos</th>
                                            <th scope="col">Fec. Nac.</th>
                                            <th scope="col" className="text-center">RUT</th>
                                            <th scope="col">Correo</th>
                                            <th scope="col">Teléfono</th>
                                            <th scope="col">Región</th>
                                            <th scope="col">Comuna</th>
                                            <th scope="col">Dirección</th>
                                            <th scope="col" className="text-center">Tipo</th>
                                            <th scope="col" className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.length > 0 ? (
                                            usuarios.map(usuario => (
                                                <tr key={getUsuarioId(usuario)}> 
                                                    <td className="text-center">{getUsuarioId(usuario)}</td>
                                                    <td>{usuario.nombreUsuario}</td>
                                                    <td>{usuario.apellidosUsuario}</td>
                                                    <td>{usuario.fechaNacUsuario ? new Date(usuario.fechaNacUsuario).toLocaleDateString('es-CL') : 'N/A'}</td> 
                                                    <td className="text-center">{usuario.rutUsuario}</td> 
                                                    <td>{usuario.correoUsuario}</td>
                                                    <td>{usuario.telefonoUsuario || 'N/A'}</td>
                                                    <td>{usuario.regionUsuario || 'N/A'}</td>
                                                    <td>{usuario.comunaUsuario || 'N/A'}</td>
                                                    <td>{usuario.direccionUsuario}</td>
                                                    <td className="text-center">{usuario.tipoUsuarioUsuario}</td> 
                                                    <td className="text-center acciones-columna">
                                                        <Link to={`/admin/editar-usuario/${getUsuarioId(usuario)}`} className="btn btn-sm btn-primary me-2">Editar</Link>
                                                        <Link to={`/admin/usuarios/historial/${getUsuarioId(usuario)}`} className="btn btn-sm btn-info me-2">Historial</Link>
                                                        <button 
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDelete(getUsuarioId(usuario))} 
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="12" className="text-center text-muted">No hay usuarios registrados en el servidor.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-center" id="paginacionUsuarios">
                            <p className="text-muted small">Mostrando {usuarios.length} usuarios.</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Admin_GestionUsuarios;