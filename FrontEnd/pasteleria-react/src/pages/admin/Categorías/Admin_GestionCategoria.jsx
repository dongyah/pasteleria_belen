import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Admin_BarraLateral from '../Admin_BarraLateral'; 
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../../styles/Admin.css';
import '../../../styles/Admin_Gestion.css'; 

const API_BASE_URL = 'http://localhost:8015/api/v1'; 

function Admin_GestionCategorias() {
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategorias = async () => {
        setCargando(true);
        setError(null);
        
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/categorias/all`, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            
            if (Array.isArray(response.data)) {
                setCategorias(response.data); 
            } else {
                console.warn("El backend no devolvió un array para categorías.");
                setCategorias([]);
            }

        } catch (err) {
            console.error("Error al cargar categorías:", err.response || err);
            
            let errorMsg = "Error al cargar categorías. Verifique el servidor y permisos.";
            if (err.response && (err.response.status === 403 || err.response.status === 401)) {
                 errorMsg = "Acceso denegado. Rol insuficiente.";
            }
            
            Swal.fire('Error de Carga', errorMsg, 'error');
            setError(errorMsg); 
        } finally {
            setCargando(false);
        }
    };
    
    const handleDelete = async (idCategoria) => {
        const token = localStorage.getItem('jwtToken');

        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${API_BASE_URL}/categorias/delete/${idCategoria}`, {
                        headers: {
                            'Authorization': `Bearer ${token}` 
                        }
                    });
                    
                    Swal.fire('¡Eliminada!', 'La categoría ha sido eliminada.', 'success');
                    fetchCategorias();
                } catch (error) {
                    console.error("Error al eliminar la categoría:", error.response || error);
                    let errorMsg = 'Error al eliminar. La categoría podría tener productos asociados.';
                    Swal.fire('Error', errorMsg, 'error');
                }
            }
        });
    };
    
    useEffect(() => {
        fetchCategorias();
    }, []); 

    if (cargando) {
        return (
            <div className="admin-layout">
                <Admin_BarraLateral />
                <div className="contenido-principal"><p className="text-center mt-5">Cargando categorías...</p></div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="admin-layout">
                <Admin_BarraLateral />
                <div className="contenido-principal"><p className="text-center mt-5 text-danger">Error: {error}</p></div>
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
                            <h5 className="mb-0">Gestión de Categorías ({categorias.length} Encontradas)</h5>
                            <Link to="/admin/nueva-categoria" className="btn btn-success">
                                + Agregar Nueva Categoría
                            </Link>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="text-center">ID</th>
                                            <th scope="col">Nombre</th>
                                            <th scope="col" className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(categorias) && categorias.length > 0 ? (
                                            categorias.map(categoria => (
                                                <tr key={categoria.idCategoria}> 
                                                    <td className="text-center">{categoria.idCategoria}</td>
                                                    <td>{categoria.nombreCategoria}</td>
                                                    <td className="text-center">
                                                        <Link 
                                                            to={`/admin/editar-categoria/${categoria.idCategoria}`} 
                                                            className="btn btn-sm btn-warning me-2"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button 
                                                            onClick={() => handleDelete(categoria.idCategoria)} 
                                                            className="btn btn-sm btn-danger"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center text-muted">No hay categorías registradas.</td>
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

export default Admin_GestionCategorias;