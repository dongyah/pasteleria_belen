import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Admin_BarraLateral from '../Admin_BarraLateral';
import axios from 'axios'; 
import Swal from 'sweetalert2'; // Asumimos que está disponible
import '../../../styles/Admin.css';
import '../../../styles/Admin_NuevoUsuario.css';

const API_BASE_URL = 'http://localhost:8015/api/v1';

// Asumimos que window.comunasPorRegion existe o es importado
const comunasPorRegion = window.comunasPorRegion || {}; 

function Admin_EditarUsuario() {
    // Usamos 'idUsuario' en lugar de 'id' para mayor claridad
    const { idUsuario } = useParams(); 
    const navigate = useNavigate();

    // --- ESTADOS DE LA DATA (AJUSTADOS A LA CONVENCIÓN ...USUARIO) ---
    const [formData, setFormData] = useState({
        nombreUsuario: '',
        apellidosUsuario: '',
        fechaNacUsuario: '',
        rutUsuario: '',
        correoUsuario: '',
        telefonoUsuario: '',
        regionUsuario: '',
        comunaUsuario: '',
        direccionUsuario: '',
        passwordUsuario: '', // Se usa solo para enviar la nueva contraseña, pero no se muestra la existente
        tipoUsuarioUsuario: '',
        codigoDescuentoUsuario: ''
    });
    
    // --- ESTADOS DE CONTROL ---
    const [showPassword, setShowPassword] = useState(false);
    const [comunasDisponibles, setComunasDisponibles] = useState([]);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [cargando, setCargando] = useState(true); 
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        // Carga de scripts (SweetAlert2, validaciones, etc.)
        const loadScripts = () => {
             if (!window.Swal) {
                const swalScript = document.createElement("script");
                swalScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
                swalScript.async = true;
                document.body.appendChild(swalScript);
             }
             const checkReady = setInterval(() => {
                 if (window.Swal && window.comunasPorRegion) {
                     setIsScriptLoaded(true);
                     clearInterval(checkReady);
                 }
             }, 100);
        };
        loadScripts();
    }, []);

    // --- 1. Carga los datos del usuario (GET) ---
    useEffect(() => {
        const fetchUsuario = async () => {
            setCargando(true);
            if (!isScriptLoaded) return;

            try {
                // GET: /api/v1/usuarios/find/{idUsuario}
                const response = await axios.get(`${API_BASE_URL}/usuarios/find/${idUsuario}`);
                const data = response.data;
                
                // Rellenar el estado único (formData) con los datos del backend
                setFormData({
                    nombreUsuario: data.nombreUsuario || '',
                    apellidosUsuario: data.apellidosUsuario || '',
                    fechaNacUsuario: data.fechaNacUsuario ? data.fechaNacUsuario.split('T')[0] : '', // Formato YYYY-MM-DD
                    rutUsuario: data.rutUsuario || '',
                    correoUsuario: data.correoUsuario || '',
                    telefonoUsuario: data.telefonoUsuario || '',
                    regionUsuario: data.regionUsuario || '',
                    comunaUsuario: data.comunaUsuario || '',
                    direccionUsuario: data.direccionUsuario || '',
                    passwordUsuario: '', // NUNCA cargar la contraseña existente
                    tipoUsuarioUsuario: data.tipoUsuarioUsuario || 'cliente',
                    codigoDescuentoUsuario: data.codigoDescuentoUsuario || ''
                });

                // Si la región está presente, actualizar comunas disponibles
                if (data.regionUsuario && comunasPorRegion) {
                    setComunasDisponibles(comunasPorRegion[data.regionUsuario] || []);
                }

            } catch (error) {
                console.error("Error al cargar el usuario:", error.response || error);
                window.Swal.fire('Error de Carga', `El usuario ID ${idUsuario} no fue encontrado o error de conexión.`, 'error');
            } finally {
                setCargando(false);
            }
        };

        if (isScriptLoaded && idUsuario) {
            fetchUsuario();
        }
    }, [idUsuario, isScriptLoaded]);


    // --- 2. Actualiza las comunas al cambiar la región ---
    useEffect(() => {
        if (isScriptLoaded && formData.regionUsuario) {
            setComunasDisponibles(comunasPorRegion[formData.regionUsuario] || []);
        }
    }, [formData.regionUsuario, isScriptLoaded]);


    // --- 3. Handler genérico para cambios en el formulario ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- 4. Handler para el envío del formulario (PUT) ---
    const handleSubmit = (event) => {
        event.preventDefault();

        if (!isScriptLoaded || !window.Swal) {
             window.Swal.fire('Error', 'Las herramientas de validación no están listas. Intente de nuevo.', 'error');
             return;
        }

        // Validación de Contraseña (Solo si se ingresó una nueva)
        if (formData.passwordUsuario && (formData.passwordUsuario.length < 4 || formData.passwordUsuario.length > 10)) {
            window.Swal.fire('Error', 'La nueva contraseña debe tener entre 4 y 10 caracteres.', 'error'); 
            return;
        }
        
        // **Otras validaciones de campos requeridos omitidas por simplicidad aquí**

        setIsSubmitting(true);
        window.Swal.fire({
            title: '¿Confirmar Actualización?',
            text: `Se modificarán los datos del usuario ID ${idUsuario}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ¡actualizar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Preparamos el payload: Si la contraseña está vacía, no la enviamos.
                    const payload = {
                        ...formData,
                        // Si passwordUsuario está vacío, no se debe enviar al backend
                        passwordUsuario: formData.passwordUsuario || undefined,
                    };
                    
                    // Llamada PUT al Backend: /api/v1/usuarios/update/{idUsuario}
                    await axios.put(`${API_BASE_URL}/usuarios/update/${idUsuario}`, payload);

                    window.Swal.fire('¡Actualizado!', 'El usuario ha sido modificado.', 'success')
                        .then(() => navigate('/admin/usuarios'));

                } catch (error) {
                    console.error("Error al actualizar:", error.response || error);
                    let errorMsg = 'Error en la actualización. Revise la ruta PUT o si el RUT/Correo ya existe.';
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
                <div className="contenido-principal"><p className="text-center mt-5">Cargando datos del usuario...</p></div>
            </div>
        );
    }
    
    return (
        <div className="admin-layout">
            <Admin_BarraLateral />
            <div className="contenido-principal">
                <main className="admin-contenido">
                    <div className="volver-atras-container">
                        <Link to="/admin/usuarios" className="volver-atras-link">
                            {/* SVG */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Volver a Gestión de Usuarios
                        </Link>
                    </div>

                    <h1 className="titulo-admin">Editar Usuario ID: {idUsuario}</h1>
                    <section className="seccion-formulario">
                        <form className="formulario-usuario" onSubmit={handleSubmit} noValidate>
                            
                            {/* NOTA: Eliminado el manejo de 'mensaje' manual ya que se usa Swal */}
                            
                            {/* --- Datos Personales --- */}
                            <h3 className="form-section-title">Datos Personales</h3>
                            <div className="fila-formulario">
                                <input type="text" name="nombreUsuario" placeholder="Nombre *" value={formData.nombreUsuario} onChange={handleChange} required />
                                <input type="text" name="apellidosUsuario" placeholder="Apellidos *" value={formData.apellidosUsuario} onChange={handleChange} required />
                            </div>
                            <div className="fila-formulario">
                                <input type="date" name="fechaNacUsuario" placeholder="Fecha Nacimiento" value={formData.fechaNacUsuario} onChange={handleChange} />
                                <input type="text" name="rutUsuario" placeholder="RUT *" value={formData.rutUsuario} onChange={handleChange} required />
                            </div>
                            
                            {/* --- Contacto y Credenciales --- */}
                            <h3 className="form-section-title">Contacto y Acceso</h3>
                            <div className="fila-formulario">
                                <input type="email" name="correoUsuario" placeholder="Correo *" value={formData.correoUsuario} onChange={handleChange} required />
                                <input type="text" name="telefonoUsuario" placeholder="Teléfono" value={formData.telefonoUsuario} onChange={handleChange} />
                            </div>
                            
                            {/* Contraseña */}
                            <div className="fila-formulario">
                                <div className="input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="passwordUsuario"
                                        placeholder="Contraseña (dejar vacío para no cambiar)"
                                        value={formData.passwordUsuario}
                                        onChange={handleChange}
                                    />
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                </div>
                                <input type="text" name="codigoDescuentoUsuario" placeholder="Código Descuento (opcional)" value={formData.codigoDescuentoUsuario} onChange={handleChange} />
                            </div>

                            {/* --- Dirección --- */}
                            <h3 className="form-section-title">Dirección y Roles</h3>
                            <input type="text" name="direccionUsuario" placeholder="Dirección (Calle y Número) *" value={formData.direccionUsuario} onChange={handleChange} required />

                            <div className="fila-formulario">
                                <select name="regionUsuario" value={formData.regionUsuario} onChange={handleChange} required>
                                    <option value="" disabled>Seleccione Región *</option>
                                    {Object.keys(comunasPorRegion).map(regionKey => (
                                        <option key={regionKey} value={regionKey}>
                                            {regionKey.charAt(0).toUpperCase() + regionKey.slice(1).replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                                <select name="comunaUsuario" value={formData.comunaUsuario} onChange={handleChange} disabled={!formData.regionUsuario} required>
                                    <option value="" disabled>Seleccione Comuna *</option>
                                    {comunasDisponibles.map(com => (
                                        <option key={com} value={com}>{com}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Roles */}
                            <div className="fila-formulario">
                                <select name="tipoUsuarioUsuario" value={formData.tipoUsuarioUsuario} onChange={handleChange} required>
                                    <option value="cliente">Cliente</option>
                                    <option value="vendedor">Vendedor</option>
                                    <option value="administrador">Administrador</option>
                                </select>
                            </div>
                            
                            {/* --- Botón Guardar --- */}
                            <div className="acciones-formulario mt-4">
                                <button type="submit" className="btn btn-guardar" disabled={isSubmitting || cargando}>
                                    {isSubmitting ? 'Actualizando...' : 'Actualizar Usuario'}
                                </button>
                            </div>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Admin_EditarUsuario;