import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Asumimos que SweetAlert2 está cargado globalmente o importado
import "../../../styles/all.css"
import "../../../styles/admin.css"; 

// URL base del backend
const API_BASE_URL = "http://localhost:8015/api/v1"; 


function Admin_NuevoUsuario() {
    const [formData, setFormData] = useState({
        // CAMPOS AJUSTADOS PARA COINCIDIR CON LA CONVENCIÓN DEL BACKEND
        nombreUsuario: '',
        apellidosUsuario: '',
        fechaNacUsuario: '',
        rutUsuario: '',
        correoUsuario: '',
        telefonoUsuario: '',
        regionUsuario: '',
        comunaUsuario: '',
        direccionUsuario: '',
        passwordUsuario: '',
        tipoUsuarioUsuario: 'cliente', // Valor por defecto
        codigoDescuentoUsuario: '' // Opcional
    });
    
    const [comunasDisponibles, setComunasDisponibles] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // --- EFECTO: Actualiza las comunas al cambiar la región ---
    useEffect(() => {
        if (formData.regionUsuario && comunasPorRegion) {
            setComunasDisponibles(comunasPorRegion[formData.regionUsuario] || []);
        } else {
            setComunasDisponibles([]);
        }
        // Resetea la comuna si la región cambia
        setFormData(prev => ({ ...prev, comunaUsuario: '' })); 
    }, [formData.regionUsuario]);

    // --- HANDLER: Maneja los cambios en todos los inputs ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- HANDLER: Envía el formulario al Backend ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Verificación básica de contraseña
        if (formData.passwordUsuario.length < 6) {
             Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres.', 'error');
             setIsSaving(false);
             return;
        }

        try {
            // Llamada POST al endpoint de guardar usuario
            const response = await axios.post(`${API_BASE_URL}/usuarios/save`, formData);

            Swal.fire({
                icon: 'success',
                title: 'Usuario Creado!',
                text: `El usuario ${response.data.nombreUsuario} ha sido registrado con éxito.`,
            });
            
            // Opcional: Limpiar el formulario o redirigir
            setFormData({
                nombreUsuario: '', apellidosUsuario: '', fechaNacUsuario: '', rutUsuario: '',
                correoUsuario: '', telefonoUsuario: '', regionUsuario: '', comunaUsuario: '',
                direccionUsuario: '', passwordUsuario: '', tipoUsuarioUsuario: 'cliente',
                codigoDescuentoUsuario: ''
            });

        } catch (error) {
            console.error("Error al crear usuario:", error.response || error);
            Swal.fire({
                icon: 'error',
                title: 'Error de registro',
                text: 'Hubo un problema al guardar el usuario. Verifique el correo o RUT.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="admin-contenido">
                <div className="volver-atras-container">
                    <Link to="/admin" className="volver-atras-link">
                        &#8592; Volver al Dashboard
                    </Link>
                </div>
                
                <h2 className="titulo-admin">Crear Nuevo Usuario</h2>
                <p className="subtitulo-admin">Formulario de registro para administradores y clientes.</p>
                
                <div className="form-container">
                    <form className="form-registro" onSubmit={handleSubmit}>
                        
                        <div className="form-group-grid">
                            {/* --- Datos Personales --- */}
                            <h3 className="form-section-title">Datos Personales</h3>
                            <div className="fila-formulario">
                                <input type="text" name="nombreUsuario" placeholder="Nombre *" value={formData.nombreUsuario} onChange={handleChange} required />
                                <input type="text" name="apellidosUsuario" placeholder="Apellidos *" value={formData.apellidosUsuario} onChange={handleChange} required />
                            </div>
                            
                            <div className="fila-formulario">
                                <input type="text" name="rutUsuario" placeholder="RUT *" value={formData.rutUsuario} onChange={handleChange} required />
                                <input type="date" name="fechaNacUsuario" placeholder="Fecha Nacimiento" value={formData.fechaNacUsuario} onChange={handleChange} />
                            </div>
                            
                            {/* --- Contacto y Credenciales --- */}
                            <h3 className="form-section-title">Contacto y Acceso</h3>
                            <input type="email" name="correoUsuario" placeholder="Correo electrónico *" value={formData.correoUsuario} onChange={handleChange} required />
                            
                            <div className="fila-formulario">
                                <input type="password" name="passwordUsuario" placeholder="Contraseña (mín. 6 chars) *" value={formData.passwordUsuario} onChange={handleChange} required />
                                <input type="text" name="telefonoUsuario" placeholder="Teléfono" value={formData.telefonoUsuario} onChange={handleChange} />
                            </div>

                            {/* --- Dirección --- */}
                            <h3 className="form-section-title">Dirección y Envío</h3>
                            <input type="text" name="direccionUsuario" placeholder="Dirección (Calle y Número) *" value={formData.direccionUsuario} onChange={handleChange} required />

                            <div className="fila-formulario">
                                <select name="regionUsuario" value={formData.regionUsuario} onChange={handleChange} required>
                                    <option value="">Seleccionar Región *</option>
                                    {Object.keys(comunasPorRegion).map(regionKey => (
                                        <option key={regionKey} value={regionKey}>
                                            {regionKey.charAt(0).toUpperCase() + regionKey.slice(1).replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                                <select name="comunaUsuario" value={formData.comunaUsuario} onChange={handleChange} disabled={!formData.regionUsuario} required>
                                    <option value="">Seleccionar Comuna *</option>
                                    {comunasDisponibles.map(com => (
                                        <option key={com} value={com}>{com}</option>
                                    ))}
                                </select>
                            </div>

                            {/* --- Roles y Extras (Solo para Admin) --- */}
                            <h3 className="form-section-title">Roles y Descuentos</h3>
                            <div className="fila-formulario">
                                <select name="tipoUsuarioUsuario" value={formData.tipoUsuarioUsuario} onChange={handleChange} required>
                                    <option value="cliente">Cliente</option>
                                    <option value="vendedor">Vendedor</option>
                                    <option value="administrador">Administrador</option>
                                </select>
                                <input type="text" name="codigoDescuentoUsuario" placeholder="Código Descuento" value={formData.codigoDescuentoUsuario} onChange={handleChange} />
                            </div>

                        </div>
                        
                        <button type="submit" className="btn btn-registro" disabled={isSaving}>
                            {isSaving ? 'Guardando...' : 'Crear Usuario'}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Admin_NuevoUsuario;