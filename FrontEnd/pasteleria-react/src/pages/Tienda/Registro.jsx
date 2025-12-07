import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../../styles/all.css";
import BarraNav from "./BarraNav";
import Footer from "./Footer";

// URL base del backend
const API_BASE_URL = "http://localhost:8015/api/v1"; 

function Registro() {
    const navigate = useNavigate();

    // --- ESTADOS ---
    const [formData, setFormData] = useState({
        nombre: "",
        apellidos: "",
        fechaNac: "", 
        rut: "",
        correo: "",
        telefono: "", 
        region: "", 
        comuna: "", 
        direccion: "", 
        password: "",
        confirmar: "",
        codigoDescuento: "",
    });

    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [comunasDisponibles, setComunasDisponibles] = useState([]);


    // --- EFECTO 1: Carga de Scripts (Admin.js, SweetAlert2) ---
    useEffect(() => {
        const loadScripts = () => {
            // 1. Carga SweetAlert2
            if (!window.Swal) {
                const swalScript = document.createElement("script");
                swalScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
                swalScript.async = true;
                document.body.appendChild(swalScript);
            }

            // 2. Carga Admin.js (asume que contiene window.validarRut, window.comunasPorRegion, etc.)
            let scriptTag = document.querySelector("script[src='/js/Admin.js']");
            if (!scriptTag) {
                 scriptTag = document.createElement("script");
                 scriptTag.src = "/js/Admin.js"; 
                 scriptTag.async = true;
                 document.body.appendChild(scriptTag);
            }
            
            // 3. Verifica que ambos estén listos
            const checkReady = setInterval(() => {
                if (window.Swal && window.validarRut && window.comunasPorRegion) { 
                    setIsScriptLoaded(true);
                    clearInterval(checkReady);
                }
            }, 100);
        };
        loadScripts();
    }, []);

    // --- EFECTO 2: Lógica de Comunas y Regiones ---
    useEffect(() => {
        if (isScriptLoaded && formData.region && window.comunasPorRegion) {
            setComunasDisponibles(window.comunasPorRegion[formData.region] || []);
        } else {
            setComunasDisponibles([]);
        }
        if (comunasDisponibles.length > 0 && !comunasDisponibles.includes(formData.comuna)) {
             setFormData(prev => ({ ...prev, comuna: '' }));
        }
    }, [formData.region, isScriptLoaded]);
    

    // --- MANEJADOR DE CAMBIOS GENERAL ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };


    // --- MANEJADOR DE ENVÍO Y VALIDACIÓN ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isScriptLoaded || !window.Swal) {
            window.alert("Error: Las herramientas de validación no están listas."); // Usar alert como fallback
            return;
        }

        // --- VALIDACIONES DETALLADAS CON SWEETALERT2 ---
        
        const fireValidationError = (text) => {
            window.Swal.fire('Error de Registro', text, 'error');
        };

        if (formData.password !== formData.confirmar) {
            fireValidationError("Las contraseñas no coinciden.");
            return;
        }
        if (!window.validarPassword(formData.password)) { 
            fireValidationError("La contraseña debe tener entre 4 y 10 caracteres.");
            return;
        }
        if (!window.validarRut(formData.rut)) { 
            fireValidationError("El RUT ingresado no es válido.");
            return;
        }
        if (!window.validarCorreo(formData.correo)) {
            fireValidationError("El correo debe ser @duocuc.cl, @profesor.duoc.cl o @gmail.com.");
            return;
        }
        if (!window.validarCampoVacio(formData.nombre) || !window.validarCampoVacio(formData.apellidos)) {
             fireValidationError("Nombre y Apellidos son obligatorios."); return;
        }
        if (!formData.region || !formData.comuna) { 
            fireValidationError("Debe seleccionar una región y comuna."); return;
        }
        if (!window.validarCampoVacio(formData.direccion)) {
             fireValidationError("La dirección es obligatoria."); return;
        }
        if (formData.telefono && !window.validarTelefono(formData.telefono)) {
             fireValidationError("El teléfono es inválido. Debe ser 9xxxxxxxx."); return;
        }

        // --- PREPARAR PAYLOAD FINAL PARA EL BACKEND ---
        const nuevoUsuarioPayload = {
            nombre: formData.nombre.trim(),
            apellidos: formData.apellidos.trim(),
            fechaNac: formData.fechaNac || null,
            rut: formData.rut.replace(/\./g, '').replace('-', '').trim().toUpperCase(), 
            correo: formData.correo.trim(),
            telefono: formData.telefono || null,
            region: formData.region,
            comuna: formData.comuna,
            direccion: formData.direccion,
            password: formData.password,
            codigoDescuento: formData.codigoDescuento || null,
            tipoUsuario: 'Cliente', // ROL FIJO PARA REGISTRO DE TIENDA
        };

        try {
            // Llamada POST a tu endpoint de creación de usuarios
            const response = await axios.post(`${API_BASE_URL}/usuarios/save`, nuevoUsuarioPayload);
            const usuarioCreado = response.data;

            window.Swal.fire('¡Registro Exitoso!', `Bienvenid@ ${usuarioCreado.nombre}. Ya puedes iniciar sesión.`, 'success')
                .then(() => {
                    navigate("/login"); 
                });

        } catch (error) {
            console.error("Error en el registro:", error.response || error);
            let errorMsg = "Error al registrar. Verifica si el correo o RUT ya existen.";
            
            if (error.response && error.response.data && error.response.data.message) {
                 errorMsg = error.response.data.message;
            }
            fireValidationError(errorMsg);
        }
    };

    return (
        <>
            <BarraNav />
            <div className="overlay">
                <div className="recuadro">
                    <div className="presentacion">
                        <h1>Registro de Cliente</h1>
                        <p>Crea tu cuenta con todos tus datos</p>
                    </div>

                    <form className="form-registro" autoComplete="off" onSubmit={handleSubmit}>
                        
                        <div className="fila-formulario">
                            <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
                            <input type="text" name="apellidos" placeholder="Apellidos" value={formData.apellidos} onChange={handleChange} required />
                        </div>
                        
                        <div className="fila-formulario">
                            <input type="date" name="fechaNac" placeholder="dd-mm-aaaa" value={formData.fechaNac} onChange={handleChange} />
                            <input type="text" name="rut" placeholder="RUT (sin puntos, con guión)" value={formData.rut} onChange={handleChange} required />
                        </div>
                        
                        <div className="fila-formulario">
                            <input type="email" name="correo" placeholder="Correo electrónico" value={formData.correo} onChange={handleChange} required />
                            <input type="tel" name="telefono" placeholder="Teléfono (ej: 912345678)" value={formData.telefono} onChange={handleChange} />
                        </div>
                        
                        <div className="fila-formulario">
                             <select name="region" value={formData.region} onChange={handleChange} disabled={!isScriptLoaded} required>
                                <option value="" disabled>Seleccione Región</option>
                                {isScriptLoaded && window.comunasPorRegion && Object.keys(window.comunasPorRegion).map(regionKey => (
                                    <option key={regionKey} value={regionKey}>{regionKey.charAt(0).toUpperCase() + regionKey.slice(1).replace('_', ' ')}</option>
                                ))}
                            </select>
                            <select name="comuna" value={formData.comuna} onChange={handleChange} disabled={!formData.region} required>
                                <option value="" disabled>Seleccione Comuna</option>
                                {comunasDisponibles.map(com => ( <option key={com} value={com}>{com}</option> ))}
                            </select>
                        </div>

                        <div className="fila-formulario">
                            <input type="text" name="direccion" placeholder="Dirección completa" value={formData.direccion} onChange={handleChange} required />
                        </div>
                        
                        <div className="fila-formulario">
                            <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
                            <input type="password" name="confirmar" placeholder="Confirmar Contraseña" value={formData.confirmar} onChange={handleChange} required />
                        </div>

                        <div className="fila-formulario" style={{justifyContent: 'center'}}>
                            <input type="text" name="codigoDescuento" placeholder="Código de descuento (opcional)" value={formData.codigoDescuento} onChange={handleChange} style={{width: '70%'}}/>
                        </div>

                        <button type="submit">Registrarse</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Registro;