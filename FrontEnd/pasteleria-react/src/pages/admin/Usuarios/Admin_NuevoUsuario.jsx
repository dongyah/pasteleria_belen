import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Admin_BarraLateral from '..//Admin_BarraLateral';
import '../../../styles/Admin.css';
import '../../../styles/Admin_NuevoUsuario.css';
import axios from 'axios'; 

const API_BASE_URL = 'http://localhost:8015/api/v1'; 

function Admin_NuevoUsuario() {
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
    passwordUsuario: '', 
    tipoUsuarioUsuario: 'Cliente',
    codigoDescuentoUsuario: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [comunasDisponibles, setComunasDisponibles] = useState([]);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [isScriptLoaded, setIsScriptLoaded] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {

    if (window.Swal && document.querySelector("script[src='/js/Admin.js']")) {
      setIsScriptLoaded(true);
      return;
    }
    if (!window.Swal) {
        const swalScript = document.createElement("script");
        swalScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
        swalScript.async = true;
        document.body.appendChild(swalScript);
    }
    if (!document.querySelector("script[src='/js/Admin.js']")) {
        const adminScript = document.createElement("script");
        adminScript.src = "/js/Admin.js";
        adminScript.async = true;
        adminScript.onload = () => setIsScriptLoaded(true);
        document.body.appendChild(adminScript);
    } else {
        const checkSwal = setInterval(() => {
            if (window.Swal) {
                setIsScriptLoaded(true);
                clearInterval(checkSwal);
            }
        }, 100);
    }
  }, []);

  useEffect(() => {
    if (isScriptLoaded && formData.regionUsuario && window.comunasPorRegion) {
      setComunasDisponibles(window.comunasPorRegion[formData.regionUsuario] || []);
    } else {
      setComunasDisponibles([]);
    }
    setFormData(prevData => ({ ...prevData, comunaUsuario: '' }));
  }, [formData.regionUsuario, isScriptLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => { 
    event.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    
    if (!isScriptLoaded || typeof window.validarRut !== 'function' || !window.Swal) {
        window.Swal.fire('Error', 'Las herramientas de validación no están listas. Intente de nuevo.', 'warning');
        return;
    }

    const validarCampoVacio = (texto) => texto.trim() !== '';
    const validarLargoMax = (texto, max) => texto.length <= max;
    const validarCorreoLocal = (correo) => /^[\w\.-]+@(duocuc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correo);
    const validarPasswordLocal = (pass) => pass.length >= 4 && pass.length <= 10;
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/; 

    if (!validarCampoVacio(formData.nombreUsuario)) { window.Swal.fire('Error', 'El nombre es obligatorio.', 'error'); return; }
    if (!validarLargoMax(formData.nombreUsuario, 50)) { window.Swal.fire('Error', 'El nombre no puede superar los 50 caracteres.', 'error'); return; }
    if (!validarCampoVacio(formData.apellidosUsuario)) { window.Swal.fire('Error', 'Los apellidos son obligatorios.', 'error'); return; }
    if (!validarLargoMax(formData.apellidosUsuario, 100)) { window.Swal.fire('Error', 'Los apellidos no pueden superar los 100 caracteres.', 'error'); return; }
    if (!window.validarRut(formData.rutUsuario)) { window.Swal.fire('Error', 'El RUT ingresado no es válido.', 'error'); return; }
    if (!validarCorreoLocal(formData.correoUsuario)) { window.Swal.fire('Error', 'El correo debe ser @duocuc.cl, @profesor.duoc.cl o @gmail.com.', 'error'); return; }
    if (!validarLargoMax(formData.correoUsuario, 100)) { window.Swal.fire('Error', 'El correo no puede superar los 100 caracteres.', 'error'); return; }
    if (!validarPasswordLocal(formData.passwordUsuario)) { window.Swal.fire('Error', 'La contraseña debe tener entre 4 y 10 caracteres.', 'error'); return; }
    if (!fechaRegex.test(formData.fechaNacUsuario)) { window.Swal.fire('Error', 'Fecha de nacimiento inválida.', 'error'); return; }
    if (!formData.regionUsuario || !formData.comunaUsuario) { window.Swal.fire('Error', 'Debe seleccionar una región y comuna.', 'error'); return; }
    if (!validarCampoVacio(formData.direccionUsuario)) { window.Swal.fire('Error', 'La dirección es obligatoria.', 'error'); return; }
    if (!validarLargoMax(formData.direccionUsuario, 300)) { window.Swal.fire('Error', 'La dirección no puede superar los 300 caracteres.', 'error'); return; }


    setIsSubmitting(true); // Bloquear el botón
    
    try {
        // Preparar el payload exactamente como lo espera el backend
        const nuevoUsuarioPayload = {
            nombreUsuario: formData.nombreUsuario,
            apellidosUsuario: formData.apellidosUsuario,
            fechaNacUsuario: formData.fechaNacUsuario || null, 
            rutUsuario: formData.rutUsuario.replace(/[^0-9kK]/g, ''), 
            correoUsuario: formData.correoUsuario,
            telefonoUsuario: formData.telefonoUsuario || null,
            regionUsuario: formData.regionUsuario,
            comunaUsuario: formData.comunaUsuario,
            direccionUsuario: formData.direccionUsuario,
            passwordUsuario: formData.passwordUsuario, 
            tipoUsuarioUsuario: formData.tipoUsuarioUsuario || 'Cliente', 
            codigoDescuentoUsuario: formData.codigoDescuentoUsuario || null,
        };
      
      // Llamada POST al Backend - Endpoint de registro
      const response = await axios.post(`${API_BASE_URL}/usuarios/save`, nuevoUsuarioPayload);

      // Manejo de éxito - La respuesta contiene token, idUsuario y role
      const usuarioCreado = response.data;
      
      // Guardar el token en localStorage para mantener la sesión
      if (usuarioCreado.token) {
          localStorage.setItem('jwtToken', usuarioCreado.token);
          localStorage.setItem('userId', usuarioCreado.idUsuario);
          localStorage.setItem('userRole', usuarioCreado.role.toUpperCase());
          
          // Configurar el header por defecto de axios con el token
          axios.defaults.headers.common['Authorization'] = `Bearer ${usuarioCreado.token}`;
      }
      
      window.Swal.fire(
          '¡Usuario creado exitosamente!', 
          `ID: ${usuarioCreado.idUsuario} | Rol: ${usuarioCreado.role}\nToken generado y guardado.`, 
          'success'
      );
      
      // Limpiar formulario
      setFormData({
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
        tipoUsuarioUsuario: 'Cliente', 
        codigoDescuentoUsuario: ''
      });
      
      // Opcional: redirigir después de 2 segundos
      setTimeout(() => {
          window.location.href = '/admin/usuarios';
      }, 2000);

    } catch (error) {
      // Manejo de errores del Backend
      console.error("Error al registrar el usuario:", error.response || error);

      let errorMsg = 'Ocurrió un error inesperado al guardar el usuario.';
      
      if (error.response) {
          if (error.response.status === 409) {
              errorMsg = 'El correo o RUT ya se encuentran registrados en el sistema.';
          } else if (error.response.status === 400) {
              errorMsg = error.response.data?.message || 'Datos inválidos. Por favor verifique los campos.';
          } else if (error.response.data?.message) {
              // Mensaje específico del servidor
              errorMsg = error.response.data.message; 
          } else if (error.response.statusText) {
              errorMsg = `Error ${error.response.status}: ${error.response.statusText}`;
          }
      } else if (error.message) {
          errorMsg = error.message;
      }
      
      window.Swal.fire('Error', errorMsg, 'error');
    } finally {
      setIsSubmitting(false); // Desbloquear el botón
    }
  };

  return (
    <div className="admin-layout">
        <Admin_BarraLateral />
        <div className="contenido-principal">
            {/* ... Enlace Volver a Gestión de Usuarios ... */}
            <div className="volver-atras-container">
                <Link to="/admin/usuarios" className="volver-atras-link">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        fill="currentColor" 
                        viewBox="0 0 16 16"
                        style={{ marginRight: '8px', verticalAlign: 'middle' }}
                    >
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg> 
                    Volver a Gestión de Usuarios
                </Link>
            </div>
            <main className="admin-contenido pt-0">
                <h1 className="titulo-admin">Nuevo Usuario</h1>
                <section className="seccion-formulario">
                    <form className="formulario-usuario" onSubmit={handleSubmit} noValidate>
                        
                        <div className="fila-formulario">
                            <input type="text" name="nombreUsuario" placeholder="Nombre" value={formData.nombreUsuario} onChange={handleChange} />
                            <input type="text" name="apellidosUsuario" placeholder="Apellidos" value={formData.apellidosUsuario} onChange={handleChange} />
                        </div>
                        <div className="fila-formulario">
                            <input type="date" name="fechaNacUsuario" value={formData.fechaNacUsuario} onChange={handleChange} />
                            <input type="text" name="rutUsuario" placeholder="RUT (sin puntos, con guión)" value={formData.rutUsuario} onChange={handleChange} />
                        </div>
                        <div className="fila-formulario">
                            <input type="email" name="correoUsuario" placeholder="Correo" value={formData.correoUsuario} onChange={handleChange} />
                            <input type="tel" name="telefonoUsuario" placeholder="Teléfono (ej: 912345678)" value={formData.telefonoUsuario} onChange={handleChange} />
                        </div>
                        <div className="fila-formulario">
                            <select name="regionUsuario" value={formData.regionUsuario} onChange={handleChange} disabled={!isScriptLoaded}>
                                <option value="" disabled>Seleccione Región</option>
                                {isScriptLoaded && window.comunasPorRegion && Object.keys(window.comunasPorRegion).map(regionKey => (
                                    <option key={regionKey} value={regionKey}>{regionKey.charAt(0).toUpperCase() + regionKey.slice(1).replace('_', ' ')}</option>
                                ))}
                            </select>
                            <select name="comunaUsuario" value={formData.comunaUsuario} onChange={handleChange} disabled={!formData.regionUsuario}>
                                <option value="" disabled>Seleccione Comuna</option>
                                {comunasDisponibles.map(com => ( <option key={com} value={com}>{com}</option> ))}
                            </select>
                        </div>
                        <div className="fila-formulario">
                            <input type="text" name="direccionUsuario" placeholder="Dirección" value={formData.direccionUsuario} onChange={handleChange} />
                        </div>
                        <div className="fila-formulario">
                            <div className="input-group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    name="passwordUsuario"
                                    placeholder="Contraseña"
                                    value={formData.passwordUsuario}
                                    onChange={handleChange}
                                />
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>
                        </div>
                        <div className="fila-formulario">
                            <select name="tipoUsuarioUsuario" value={formData.tipoUsuarioUsuario} onChange={handleChange}>
                                <option value="CLIENTE">Cliente</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="VENDEDOR">Vendedor</option>
                            </select>
                            <input 
                                type="text" 
                                name="codigoDescuentoUsuario" 
                                placeholder="Código de Descuento (opcional)" 
                                value={formData.codigoDescuentoUsuario} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="acciones-formulario mt-4">
                            <button type="submit" className="btn-guardar" disabled={!isScriptLoaded || isSubmitting}>
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    </div>
  );
}

export default Admin_NuevoUsuario;