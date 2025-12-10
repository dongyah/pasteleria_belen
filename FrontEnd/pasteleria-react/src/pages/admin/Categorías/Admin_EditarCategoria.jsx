import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Admin_BarraLateral from '../Admin_BarraLateral';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import '../../../styles/Admin.css';
import '../../../styles/Admin_NuevoUsuario.css'; 
import '../../../styles/Admin_NuevoProducto.css'; 

const API_BASE_URL = 'http://localhost:8015/api/v1';

function Admin_EditarCategoria() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nombreCategoria, setNombreCategoria] = useState(''); 
    const [cargando, setCargando] = useState(true); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        const loadScripts = () => {
            if (!window.Swal) {
                const swalScript = document.createElement("script");
                swalScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
                swalScript.async = true;
                document.body.appendChild(swalScript);
            }
            const checkReady = setInterval(() => {
                if (window.Swal) {
                    setIsScriptLoaded(true);
                    clearInterval(checkReady);
                }
            }, 100);
        };
        loadScripts();
    }, []);

    useEffect(() => {
        const fetchCategoria = async () => {
            setCargando(true);
            if (!isScriptLoaded) return; 
            
            const token = localStorage.getItem('jwtToken');

            if (!id || isNaN(Number(id))) {
                 window.Swal.fire('Error', 'ID de categoría no válido o faltante.', 'error');
                 setCargando(false);
                 return;
            }
            
            try {
                const response = await axios.get(`${API_BASE_URL}/categorias/find/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });
                const data = response.data;
                setNombreCategoria(data.nombreCategoria || data.nombre || ''); 

            } catch (error) {
                console.error("Error al cargar la categoría:", error.response || error);
                
                let errorMsg = `Categoría ID ${id} no encontrada o error de conexión.`;
                if (error.response && error.response.status === 403) {
                     errorMsg = 'Acceso denegado (403): Su token no tiene permisos de edición.';
                }
                
                window.Swal.fire('Error de Carga', errorMsg, 'error');
            } finally {
                setCargando(false);
            }
        };

        if (isScriptLoaded) {
            fetchCategoria();
        }
    }, [id, isScriptLoaded]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isScriptLoaded || !window.Swal) {
             console.error('SweetAlert2 no está listo.');
             return;
        }
        if (!nombreCategoria.trim()) {
            window.Swal.fire('Error de Validación', 'El nombre de la categoría es obligatorio.', 'error');
            return;
        }
        
        setIsSubmitting(true);
        const token = localStorage.getItem('jwtToken');

        window.Swal.fire({
            title: '¿Confirmar Actualización?',
            text: `Se modificará la categoría ID ${id}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, ¡actualizar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const categoriaPayload = {
                        nombreCategoria: nombreCategoria, 
                    };
                    
                    await axios.put(`${API_BASE_URL}/categorias/update/${id}`, categoriaPayload, {
                        headers: {
                            'Authorization': `Bearer ${token}` 
                        }
                    });

                    window.Swal.fire('¡Actualizado!', 'La categoría ha sido modificada.', 'success')
                        .then(() => navigate('/admin/categorias'));

                } catch (error) {
                    console.error("Error al actualizar:", error.response || error);
                    let errorMsg = 'Error en la actualización. Revise permisos o si el nombre ya existe.';
                    window.Swal.fire('Error', errorMsg, 'error');
                }
            }
            setIsSubmitting(false);
        });
    };

    return (
        <div className="admin-layout">
            <Admin_BarraLateral />
            <div className="contenido-principal">
                <main className="admin-contenido">
                    <div className="volver-atras-container">
                        <Link to="/admin/categorias" className="volver-atras-link">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Volver a Gestión de Categorías
                        </Link>
                    </div>

                    <h1 className="titulo-admin">Editar Categoría ID: {id}</h1>
                    <section className="seccion-formulario">
                        <form className="formulario-usuario producto" onSubmit={handleSubmit} noValidate>
                            
                            <div className="fila-formulario" style={{maxWidth: '400px', margin: '0 auto'}}>
                                <input 
                                    type="text" 
                                    name="nombreCategoria" 
                                    placeholder="Nombre de la Categoría" 
                                    value={nombreCategoria} 
                                    onChange={(e) => setNombreCategoria(e.target.value)} 
                                    disabled={isSubmitting || cargando}
                                    required
                                    style={{width: '100%'}}
                                />
                            </div>
                            
                            <div className="acciones-formulario mt-4">
                                <button type="submit" className="btn-guardar" disabled={isSubmitting || cargando}>
                                    {isSubmitting ? 'Actualizando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Admin_EditarCategoria;