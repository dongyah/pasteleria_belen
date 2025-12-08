import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Admin_BarraLateral from '../Admin_BarraLateral';
import axios from 'axios';
import Swal from 'sweetalert2'; // Asumimos que SweetAlert2 está cargado
import '../../../styles/Admin.css';
import '../../../styles/Admin_NuevoProducto.css';

const API_BASE_URL = 'http://localhost:8015/api/v1';

function Admin_EditarProducto() {

    const { id } = useParams();
    const navigate = useNavigate();

    // --- ESTADO: AJUSTADO A LA CONVENCIÓN DEL BACKEND (Ej: nombreProducto) ---
    const [formData, setFormData] = useState({
        codigoProducto: '',
        nombreProducto: '',
        descripcionProducto: '',
        precioProducto: '',
        stockProducto: '',
        stockCriticoProducto: '',
        nombreCategoria: '', // Campo que se usa para el select y el payload
        imagenProducto: '',
    });

    // --- ESTADOS DE CONTROL ---
    const [categoriasBD, setCategoriasBD] = useState([]); // Para cargar categorías dinámicos
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [cargando, setCargando] = useState(true); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);


    useEffect(() => {
        // Carga de SweetAlert2
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

    // --- 1. Carga de Categorías y Producto Inicial ---
    useEffect(() => {
        const fetchDatos = async () => {
            setCargando(true);
            try {
                // A. Cargar Categorías
                const [prodResponse, catResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/productos/find/${id}`),
                    axios.get(`${API_BASE_URL}/categorias/all`)
                ]);
                
                setCategoriasBD(catResponse.data);
                const data = prodResponse.data;

                // B. Rellenar formData con la convención del backend
                setFormData({
                    codigoProducto: data.codigoProducto || '',
                    nombreProducto: data.nombreProducto || '',
                    descripcionProducto: data.descripcionProducto || '',
                    // Convertimos a string para el input type="number"
                    precioProducto: String(data.precioProducto || 0), 
                    stockProducto: String(data.stockProducto || 0),
                    stockCriticoProducto: String(data.stockCriticoProducto || ''),
                    // Asumimos que el backend devuelve el nombre de la categoría en 'nombreCategoria'
                    nombreCategoria: data.nombreCategoria || '', 
                    imagenProducto: data.imagenProducto || '', 
                });

            } catch (error) {
                console.error("Error al cargar datos:", error.response || error);
                if (window.Swal) {
                    window.Swal.fire('Error de Carga', `El producto ID ${id} no fue encontrado o error de conexión.`, 'error');
                } else {
                    setMensaje({ texto: `Error: Producto ID ${id} no encontrado.`, tipo: 'error' });
                }
            } finally {
                setCargando(false);
            }
        };

        if (isScriptLoaded) {
            fetchDatos();
        }
    }, [id, isScriptLoaded]);


    // --- 2. Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                 setFormData(prevData => ({ ...prevData, imagenProducto: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
             setFormData(prevData => ({ ...prevData, imagenProducto: '' }));
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setMensaje({ texto: '', tipo: '' });

        if (!isScriptLoaded || !window.Swal) {
             setMensaje({ texto: 'Las herramientas de validación no están listas.', tipo: 'error' });
             return;
        }

        // Validación de datos (usamos los nombres corregidos del estado)
        const isNumeric = (val) => !isNaN(parseFloat(val)) && isFinite(val);
        
        if (!formData.nombreProducto.trim() || formData.nombreProducto.length > 100) {
            window.Swal.fire('Error de Validación', 'El nombre es obligatorio y no puede superar los 100 caracteres.', 'error'); return;
        }
        if (formData.descripcionProducto.length > 500) {
            window.Swal.fire('Error de Validación', 'La descripción no puede superar los 500 caracteres.', 'error'); return;
        }
        if (!formData.nombreCategoria) {
            window.Swal.fire('Error de Validación', 'Debe seleccionar una categoría.', 'error'); return;
        }
        if (!isNumeric(formData.precioProducto) || parseFloat(formData.precioProducto) < 0) {
            window.Swal.fire('Error de Validación', 'El precio es obligatorio y debe ser un número mayor o igual a 0.', 'error'); return;
        }
        if (!isNumeric(formData.stockProducto) || parseInt(formData.stockProducto, 10) < 0 || !Number.isInteger(parseFloat(formData.stockProducto))) {
            window.Swal.fire('Error de Validación', 'El stock debe ser un número entero mayor o igual a 0.', 'error'); return;
        }

        setIsSubmitting(true);
        window.Swal.fire({
            title: '¿Confirmar Actualización?',
            text: `Se modificarán los datos del producto ID ${id}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, ¡actualizar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // --- PAYLOAD FINAL AJUSTADO ---
                    const productoPayload = {
                        codigoProducto: formData.codigoProducto, // El código no se edita, pero se envía
                        nombreProducto: formData.nombreProducto,
                        descripcionProducto: formData.descripcionProducto || null,
                        precioProducto: parseFloat(formData.precioProducto),
                        stockProducto: parseInt(formData.stockProducto, 10),
                        stockCriticoProducto: formData.stockCriticoProducto ? parseInt(formData.stockCriticoProducto, 10) : null,
                        nombreCategoria: formData.nombreCategoria, 
                        imagenProducto: formData.imagenProducto || null, 
                    };
                    
                    // Llamada PUT al Backend
                    await axios.put(`${API_BASE_URL}/productos/update/${id}`, productoPayload);


                    window.Swal.fire('¡Actualizado!', 'El producto ha sido modificado.', 'success')
                        .then(() => navigate('/admin/productos'));

                } catch (error) {
                    console.error("Error al actualizar:", error.response || error);
                    let errorMsg = 'Error en la actualización. Revise la ruta PUT o los datos.';
                    window.Swal.fire('Error', errorMsg, 'error');
                }
            }
            setIsSubmitting(false);
        });
        
    };

    if (cargando) {
        return (
            <div className="admin-layout">
                <Admin_BarraLateral />
                <div className="contenido-principal"><p className="text-center mt-5">Cargando datos del producto...</p></div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <Admin_BarraLateral />
            <div className="contenido-principal">
                <main className="admin-contenido">
                    {/* --- BOTÓN DE VOLVER --- */}
                    <div className="volver-atras-container">
                        <Link to="/admin/productos" className="volver-atras-link">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Volver a Gestión de Productos
                        </Link>
                    </div>

                    <h1 className="titulo-admin">Editar Producto ID: {id}</h1>
                    <section className="seccion-formulario">
                        <form className="formulario-usuario producto" onSubmit={handleSubmit} noValidate>
                            {mensaje.texto && (
                                <p className={`alert ${mensaje.tipo === 'error' ? 'alert-danger' : 'alert-success'}`}>
                                    {mensaje.texto}
                                </p>
                            )}
                            
                            {/* --- Filas de Inputs (Usando los nombres corregidos) --- */}
                            <div className="fila-formulario">
                                {/* Código (Disabled, se carga al inicio) */}
                                <input type="text" name="codigoProducto" placeholder="Código Producto" value={formData.codigoProducto} disabled />
                                <input type="text" name="nombreProducto" placeholder="Nombre" value={formData.nombreProducto} onChange={handleChange} required />
                            </div>
                            <div className="fila-formulario">
                                <textarea name="descripcionProducto" placeholder="Descripción Producto (Máx. 500)" value={formData.descripcionProducto} onChange={handleChange}></textarea>
                            </div>
                            <div className="fila-formulario">
                                <input type="number" name="precioProducto" placeholder="Precio $" value={formData.precioProducto} onChange={handleChange} required />
                                <input type="number" name="stockProducto" placeholder="Stock" value={formData.stockProducto} onChange={handleChange} required />
                                <input type="number" name="stockCriticoProducto" placeholder="Stock Crítico" value={formData.stockCriticoProducto} onChange={handleChange} />
                            </div>
                            <div className="fila-formulario">
                                {/* Select de Categorías Dinámico */}
                                <select name="nombreCategoria" value={formData.nombreCategoria} onChange={handleChange} required>
                                    <option value="" disabled>Seleccione Categoría *</option>
                                    {categoriasBD.map(cat => (
                                         <option key={cat.id || cat.nombre} value={cat.nombre}> 
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                                <input type="file" accept="image/*" name="imagenFile" className="form-control" onChange={handleImageChange} />
                            </div>
                            
                            {/* --- Vista Previa de Imagen --- */}
                            {formData.imagenProducto && (
                                <div className="text-center mt-3">
                                    <p>Vista previa:</p>
                                    <img src={formData.imagenProducto} alt={formData.nombreProducto} style={{ maxWidth: '200px', height: 'auto', borderRadius: '8px', border: '1px solid #ddd' }} />
                                </div>
                            )}

                            {/* --- Botón Guardar --- */}
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

export default Admin_EditarProducto;