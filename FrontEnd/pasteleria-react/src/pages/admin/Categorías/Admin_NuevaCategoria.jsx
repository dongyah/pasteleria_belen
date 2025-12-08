import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Admin_BarraLateral from '../Admin_BarraLateral'; // Asumo que este componente existe
import axios from 'axios';
import Swal from 'sweetalert2'; // Asumimos que SweetAlert2 está cargado

import '../../../styles/Admin.css';
import '../../../styles/Admin_NuevoUsuario.css'; 
import '../../../styles/Admin_NuevoProducto.css'; 

const API_BASE_URL = 'http://localhost:8015/api/v1'; 

function Admin_NuevaCategoria() {

    const navigate = useNavigate();

    // --- ESTADO CORREGIDO: Usamos la convención 'nombreCategoria' para el estado ---
    const [nombreCategoria, setNombreCategoria] = useState(''); 


    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); 


    useEffect(() => {
        // Carga de SweetAlert2
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

        // Validación de campo usando el estado corregido
        if (!nombreCategoria.trim()) {
            window.Swal.fire('Error de Validación', 'El nombre de la categoría es obligatorio.', 'error');
            return;
        }

        setIsSubmitting(true);
        
        try {
            // --- PAYLOAD AJUSTADO ---
            const categoriaPayload = {
                nombreCategoria: nombreCategoria, // CLAVE: Enviamos el nombre con el sufijo
            };
            
            // Llamada POST al Backend
            const response = await axios.post(`${API_BASE_URL}/categorias/save`, categoriaPayload);

            const categoriaCreada = response.data;
            
            window.Swal.fire(
                '¡Categoría Creada!', 
                `La categoría "${categoriaCreada.nombreCategoria}" (ID: ${categoriaCreada.id || 'N/A'}) fue guardada.`, 
                'success'
            );
            
            setNombreCategoria(''); // Limpiamos el estado
            navigate('/admin/categorias'); 

        } catch (error) {

            console.error("Error al guardar categoría:", error.response || error);
            let errorMsg = 'Error al guardar la categoría. Revise si el nombre ya existe o la ruta POST.';
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
                    {/* --- BOTÓN DE VOLVER --- */}
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
                                    name="nombreCategoria" // CLAVE: Nombre del input para coincidir con el estado
                                    placeholder="Nombre de la Categoría" 
                                    value={nombreCategoria} 
                                    onChange={(e) => setNombreCategoria(e.target.value)} // Actualiza el estado corregido
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