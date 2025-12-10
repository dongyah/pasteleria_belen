import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Admin_BarraLateral from '../Admin_BarraLateral'; 
import axios from 'axios';
import Swal from 'sweetalert2'; 

import '../../../styles/Admin.css';
import '../../../styles/Admin_NuevoUsuario.css'; 
import '../../../styles/Admin_NuevoProducto.css'; 

const API_BASE_URL = 'http://localhost:8015/api/v1'; 

function Admin_NuevaCategoria() {

    const navigate = useNavigate();
    const [nombreCategoria, setNombreCategoria] = useState(''); 
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); 


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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMensaje({ texto: '', tipo: '' });

        if (!isScriptLoaded || !window.Swal) {
             setMensaje({ texto: 'Las herramientas de validación no están listas. Intente de nuevo.', tipo: 'error' });
             return;
        }

        if (!nombreCategoria.trim()) {
            window.Swal.fire('Error de Validación', 'El nombre de la categoría es obligatorio.', 'error');
            return;
        }

        setIsSubmitting(true);
        
        const token = localStorage.getItem('jwtToken'); 
        
        if (!token) {
            window.Swal.fire('Error', 'Debe iniciar sesión para crear categorías.', 'error');
            setIsSubmitting(false);
            return;
        }
        
        try {
            const categoriaPayload = {
                nombreCategoria: nombreCategoria, 
            };
            
            const response = await axios.post(`${API_BASE_URL}/categorias/save`, categoriaPayload, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            const categoriaCreada = response.data;
            
            window.Swal.fire(
                '¡Categoría Creada!', 
                `La categoría "${categoriaCreada.nombreCategoria}" (ID: ${categoriaCreada.idCategoria || 'N/A'}) fue guardada.`, 
                'success'
            );
            
            setNombreCategoria('');
            navigate('/admin/categorias'); 
        } catch (error) {

            console.error("Error al guardar categoría:", error.response || error);
            let errorMsg = 'Error al guardar la categoría. Revise si el nombre ya existe o la ruta POST.';
            
            if (error.response && error.response.status === 403) {
                 errorMsg = 'Acceso denegado (403). Su usuario no tiene el rol ADMIN/VENDEDOR.';
            } else if (error.response && error.response.status === 409) {
                 errorMsg = 'El nombre de la categoría ya existe.';
            }
            
            window.Swal.fire('Error', errorMsg, 'error');
        } finally {
            setIsSubmitting(false);
        }
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

                    <h1 className="titulo-admin">Nueva Categoría</h1>
                    <section className="seccion-formulario">
                        <form className="formulario-usuario producto" onSubmit={handleSubmit} noValidate>
                            {mensaje.texto && (
                                <p className={`alert ${mensaje.tipo === 'error' ? 'alert-danger' : 'alert-success'}`}>
                                    {mensaje.texto}
                                </p>
                            )}
                            
                            <div className="fila-formulario" style={{maxWidth: '400px', margin: '0 auto'}}>
                                <input 
                                    type="text" 
                                    name="nombreCategoria" 
                                    placeholder="Nombre de la Categoría" 
                                    value={nombreCategoria} 
                                    onChange={(e) => setNombreCategoria(e.target.value)} 
                                    style={{width: '100%'}}
                                    required
                                />
                            </div>
                            
                            <div className="acciones-formulario mt-4">
                                <button type="submit" className="btn-guardar" disabled={isSubmitting || !isScriptLoaded}>
                                    {isSubmitting ? 'Guardando...' : 'Guardar Categoría'}
                                </button>
                            </div>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Admin_NuevaCategoria;