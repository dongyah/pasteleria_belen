import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Admin_BarraLateral from '../Admin_BarraLateral'; // Asumo que este componente existe
import axios from 'axios'; 
import Swal from 'sweetalert2'; // Asumo que SweetAlert2 está disponible
import '../../../styles/Admin.css';
import '../../../styles/Admin_NuevoProducto.css';


const API_BASE_URL = 'http://localhost:8015/api/v1'; 

function Admin_NuevoProducto() {

    const navigate = useNavigate();

    // --- ESTADO: AJUSTADO A LA CONVENCIÓN DEL BACKEND (Ej: nombreProducto) ---
    const [formData, setFormData] = useState({
        codigoProducto: '',
        nombreProducto: '',
        descripcionProducto: '',
        precioProducto: '',
        stockProducto: '',
        stockCriticoProducto: '',
        nombreCategoria: '', // Usamos nombreCategoria para el select
        imagenProducto: '', // Contiene el Base64 de la imagen
    });

    // --- ESTADOS DE CONTROL ---
    const [categoriasBD, setCategoriasBD] = useState([]); 
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); 


    // --- 1. Carga de Scripts y Librerías (Swal) ---
    useEffect(() => {
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
    }, []);
    
    // --- 2. Carga las Categorías desde el Backend ---
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                // Llama al endpoint de listado de categorías
                const response = await axios.get(`${API_BASE_URL}/categorias/all`);
                setCategoriasBD(response.data);
            } catch (error) {
                console.error("Error al cargar las categorías:", error);
                // Usamos Swal si está cargado
                if (isScriptLoaded && window.Swal) {
                    window.Swal.fire('Error', 'Error al cargar las categorías desde el servidor.', 'error');
                } else {
                    setMensaje({ texto: 'Error al cargar las categorías desde el servidor.', tipo: 'error' });
                }
            }
        };

        if (isScriptLoaded) {
            fetchCategorias();
        }
    }, [isScriptLoaded]); 


    // --- 3. HANDLER: Maneja los cambios en todos los inputs ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };


    // --- 4. HANDLER: Captura el archivo y lo convierte a Base64 ---
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


    // --- 5. HANDLER: Envío y Validación ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        setMensaje({ texto: '', tipo: '' }); // Limpiar mensaje de error/éxito

        // --- VALIDACIONES ---
        const isNumeric = (val) => !isNaN(parseFloat(val)) && isFinite(val);
        
        if (!formData.codigoProducto.trim() || formData.codigoProducto.length < 3) {
            window.Swal.fire('Error', 'El código debe tener al menos 3 caracteres.', 'error'); return;
        }
        if (!formData.nombreProducto.trim() || formData.nombreProducto.length > 100) {
            window.Swal.fire('Error', 'El nombre es obligatorio y no puede superar los 100 caracteres.', 'error'); return;
        }
        if (formData.descripcionProducto.length > 500) {
            window.Swal.fire('Error', 'La descripción no puede superar los 500 caracteres.', 'error'); return;
        }
        if (!formData.nombreCategoria) { // Usamos nombreCategoria
            window.Swal.fire('Error', 'Debe seleccionar una categoría.', 'error'); return;
        }
        if (!isNumeric(formData.precioProducto) || parseFloat(formData.precioProducto) < 0) {
            window.Swal.fire('Error', 'El precio es obligatorio y debe ser un número mayor o igual a 0.', 'error'); return;
        }
        if (!isNumeric(formData.stockProducto) || parseInt(formData.stockProducto, 10) < 0 || !Number.isInteger(parseFloat(formData.stockProducto))) {
            window.Swal.fire('Error', 'El stock debe ser un número entero mayor o igual a 0.', 'error'); return;
        }
        if (formData.stockCriticoProducto && (!isNumeric(formData.stockCriticoProducto) || parseInt(formData.stockCriticoProducto, 10) < 0 || !Number.isInteger(parseFloat(formData.stockCriticoProducto)))) {
            window.Swal.fire('Error', 'El stock crítico debe ser un número entero mayor o igual a 0.', 'error'); return;
        }
        // --- FIN VALIDACIONES ---

        setIsSubmitting(true);
        
        try {
            // --- PAYLOAD AJUSTADO AL BACKEND ---
            const productoPayload = {
                codigoProducto: formData.codigoProducto,
                nombreProducto: formData.nombreProducto,
                descripcionProducto: formData.descripcionProducto || null,
                precioProducto: parseInt(formData.precioProducto), 
                stockProducto: parseInt(formData.stockProducto, 10),
                // Solo enviamos stockCritico si tiene valor, sino null
                stockCriticoProducto: formData.stockCriticoProducto ? parseInt(formData.stockCriticoProducto, 10) : null, 
                nombreCategoria: formData.nombreCategoria, // El backend recibe el nombre de la categoría
                imagenProducto: formData.imagenProducto || null, 
            };
            
            // Llamada POST al Backend
            await axios.post(`${API_BASE_URL}/productos/save`, productoPayload);

            window.Swal.fire('¡Producto Creado!', 'El producto ha sido registrado con éxito.', 'success')
                .then(() => {
                    // Limpiar formulario y redirigir
                    setFormData({ codigoProducto: '', nombreProducto: '', descripcionProducto: '', precioProducto: '', stockProducto: '', stockCriticoProducto: '', nombreCategoria: '', imagenProducto: '' });
                    navigate('/admin/productos'); 
                });

        } catch (error) {
            console.error("Error al registrar el producto:", error.response || error);
            let errorMsg = 'Error al guardar el producto. Revise si el código o nombre ya existen.';
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
                        <Link to="/admin/productos" className="volver-atras-link">
                            {/* SVG... */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Volver a Gestión de Productos
                        </Link>
                    </div>

                    <h1 className="titulo-admin">Nuevo Producto</h1>
                    <section className="seccion-formulario">
                        <form className="formulario-usuario producto" onSubmit={handleSubmit} noValidate>
                            
                            {/* Mostrar mensaje de carga de categorías si es necesario */}
                            {mensaje.texto && (
                                <p className={`alert ${mensaje.tipo === 'exito' ? 'alert-success' : 'alert-danger'}`}>
                                    {mensaje.texto}
                                </p>
                            )}

                            {/* --- Filas de Inputs --- */}
                            <div className="fila-formulario">
                                {/* Usar nombres de campo corregidos */}
                                <input type="text" name="codigoProducto" placeholder="Código Producto (Mín. 3)" value={formData.codigoProducto} onChange={handleChange} required />
                                <input type="text" name="nombreProducto" placeholder="Nombre (Máx. 100)" value={formData.nombreProducto} onChange={handleChange} required />
                            </div>
                            <div className="fila-formulario">
                                <textarea name="descripcionProducto" placeholder="Descripción Producto (Máx. 500)" value={formData.descripcionProducto} onChange={handleChange}></textarea>
                            </div>
                            <div className="fila-formulario">
                                <input type="number" name="precioProducto" placeholder="Precio $ (Mín. 0)" value={formData.precioProducto} onChange={handleChange} required />
                                <input type="number" name="stockProducto" placeholder="Stock (Entero, Mín. 0)" value={formData.stockProducto} onChange={handleChange} required />
                                <input type="number" name="stockCriticoProducto" placeholder="Stock Crítico (Opcional)" value={formData.stockCriticoProducto} onChange={handleChange} />
                            </div>
                            <div className="fila-formulario">
                                {/* Usamos nombreCategoria para el select */}
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
                                    <img src={formData.imagenProducto} alt="Vista previa" style={{ maxWidth: '200px', height: 'auto', borderRadius: '8px', border: '1px solid #ddd' }} />
                                </div>
                            )}

                            {/* --- Botón Guardar --- */}
                            <div className="acciones-formulario mt-4">
                                <button type="submit" className="btn-guardar" disabled={isSubmitting}>
                                    {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
                                </button>
                            </div>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Admin_NuevoProducto;