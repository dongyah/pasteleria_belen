import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Admin_BarraLateral from '../Admin_BarraLateral'; 
import axios from 'axios';
import Swal from 'sweetalert2'; // Asumimos que SweetAlert2 está disponible
import '../../../styles/Admin.css';
import '../../../styles/Admin_Gestion.css';

const API_BASE_URL = 'http://localhost:8015/api/v1'; 

function Admin_GestionCategorias() {

    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false); 

    // Carga de SweetAlert2
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

    // Fetch de categorías
    const fetchCategorias = async () => {
        setCargando(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/categorias/all`);
            // Nota: Asumimos que el backend puede devolver 'nombre' o 'nombreCategoria'.
            // Usamos lo que esté disponible.
            setCategorias(response.data); 
        } catch (err) {
            console.error("Error al cargar categorías:", err.response || err);
            
            let errorMsg = "Error al conectar con el servidor o cargar categorías. Revise la ruta /api/categorias/all.";
            setError(errorMsg);
        } finally {
            setCargando(false);
        }
    };
    
    useEffect(() => {
        if (isScriptLoaded) {
            fetchCategorias(); 
        }
    }, [isScriptLoaded]); 
    
    // Handler de eliminación
    const handleDelete = async (idCategoria) => {
        if (!isScriptLoaded || !window.Swal) {
            console.error('SweetAlert2 no está cargado.');
            window.alert('Error: Herramienta de confirmación no disponible.');
            return;
        }

        const result = await window.Swal.fire({
            title: '¿Estás seguro?',
            text: `Se eliminará la categoría ID ${idCategoria}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡Eliminar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                // Llamada DELETE al Backend
                await axios.delete(`${API_BASE_URL}/categorias/delete/${idCategoria}`); 
                
                setCategorias(categorias.filter(c => c.id !== idCategoria));
                window.Swal.fire('¡Eliminado!', 'La categoría ha sido eliminada correctamente.', 'success');

            } catch (err) {
                console.error("Error al eliminar:", err.response || err);
                let errorMsg = 'Error al intentar eliminar. Podría tener productos asociados.';
                window.Swal.fire('Error', errorMsg, 'error');
            }
        }
    };
    
    // Función de ayuda para obtener el nombre (priorizando 'nombreCategoria' si existe)
    const getNombre = (categoria) => {
        return categoria.nombreCategoria || categoria.nombre || 'Nombre No Definido';
    };


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
                            <h5 className="mb-0">Gestión de Categorías ({categorias.length} Registradas)</h5>
                            <Link to="/admin/nueva-categoria" className="btn btn-primary">Nueva Categoría</Link>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="text-center">ID</th>
                                            <th scope="col">Nombre de Categoría</th>
                                            <th scope="col" className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categorias.length > 0 ? (
                                            categorias.map(categoria => (
                                                <tr key={categoria.id}> 
                                                    <td className="text-center">{categoria.id}</td>
                                                    {/* --- CORRECCIÓN APLICADA AQUÍ --- */}
                                                    <td>{getNombre(categoria)}</td> 
                                                    <td className="text-center">
                                                        {/* Navegación a la vista de edición */}
                                                        <Link to={`/admin/editar-categoria/${categoria.id}`} className="btn btn-sm btn-primary me-2">Editar</Link>
                                                        
                                                        {/* Botón Eliminar */}
                                                        <button 
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDelete(categoria.id)} 
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center text-muted">No hay categorías registradas en el servidor.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-center" id="paginacionCategorias">
                            <p className="text-muted small">Mostrando {categorias.length} categorías.</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Admin_GestionCategorias;