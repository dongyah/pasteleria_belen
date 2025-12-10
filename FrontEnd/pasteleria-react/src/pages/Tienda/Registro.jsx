import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../../styles/all.css";
import BarraNav from "./BarraNav";
import Footer from "./Footer";
import Swal from 'sweetalert2'; 

const API_BASE_URL = "http://localhost:8015/api/v1"; 

const comunasPorRegion = window.comunasPorRegion || {  };


function Registro() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombreUsuario: "",
        apellidosUsuario: "",
        fechaNacUsuario: "", 
        rutUsuario: "",
        correoUsuario: "",
        telefonoUsuario: "", 
        regionUsuario: "", 
        comunaUsuario: "", 
        direccionUsuario: "", 
        passwordUsuario: "",
        confirmarUsuario: "",
        codigoDescuentoUsuario: "",
    });

    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [comunasDisponibles, setComunasDisponibles] = useState([]);
    
    const validarCampoVacio = window.validarCampoVacio || ((t) => t && t.trim() !== '');

    useEffect(() => {
        const loadScripts = () => {
            if (!window.Swal) {
                const swalScript = document.createElement("script");
                swalScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
                swalScript.async = true;
                document.body.appendChild(swalScript);
            }

            let scriptTag = document.querySelector("script[src='/js/Admin.js']");
            if (!scriptTag) {
                scriptTag = document.createElement("script");
                scriptTag.src = "/js/Admin.js"; 
                scriptTag.async = true;
                document.body.appendChild(scriptTag);
            }
            
            const checkReady = setInterval(() => {
                if (window.Swal && window.validarRut && window.comunasPorRegion) { 
                    setIsScriptLoaded(true);
                    clearInterval(checkReady);
                }
            }, 100);
        };
        loadScripts();
    }, []);

    useEffect(() => {
        const regionKey = formData.regionUsuario; 

        if (isScriptLoaded && regionKey && comunasPorRegion) {
            const nuevasComunas = comunasPorRegion[regionKey] || [];
            setComunasDisponibles(nuevasComunas);
            
            if (!nuevasComunas.includes(formData.comunaUsuario)) {
                 setFormData(prev => ({ ...prev, comunaUsuario: '' }));
            }
        } else {
            setComunasDisponibles([]);
        }
    }, [formData.regionUsuario, isScriptLoaded]); 


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isScriptLoaded || !window.Swal) { window.alert("Error: Las herramientas de validación no están listas."); return; }
        const validarRut = window.validarRut;
        const validarCorreo = window.validarCorreo;
        const validarPassword = window.validarPassword;
        const validarTelefono = window.validarTelefono;
        
        const fireValidationError = (text) => { window.Swal.fire('Error de Registro', text, 'error'); };

        if (formData.passwordUsuario !== formData.confirmarUsuario) { fireValidationError("Las contraseñas no coinciden."); return; }
        if (!validarPassword(formData.passwordUsuario)) { fireValidationError("La contraseña debe tener entre 4 y 10 caracteres."); return; }
        if (!validarRut(formData.rutUsuario)) { fireValidationError("El RUT ingresado no es válido."); return; }
        if (!validarCorreo(formData.correoUsuario)) { fireValidationError("El correo debe ser @duocuc.cl, @profesor.duoc.cl o @gmail.com."); return; }
        if (!validarCampoVacio(formData.nombreUsuario) || !validarCampoVacio(formData.apellidosUsuario)) { fireValidationError("Nombre y Apellidos son obligatorios."); return; }
        if (!formData.regionUsuario || !formData.comunaUsuario) { fireValidationError("Debe seleccionar una región y comuna."); return; }
        if (!validarCampoVacio(formData.direccionUsuario)) { fireValidationError("La dirección es obligatoria."); return; }
        if (formData.telefonoUsuario && !validarTelefono(formData.telefonoUsuario)) { fireValidationError("El teléfono es inválido. Debe ser 9xxxxxxxx."); return; }


    const nuevoUsuarioPayload = {
        nombreUsuario: formData.nombreUsuario.trim(),
        apellidosUsuario: formData.apellidosUsuario.trim(),
        fechaNacUsuario: formData.fechaNacUsuario || null,
        rutUsuario: formData.rutUsuario.replace(/\./g, '').replace('-', '').trim().toUpperCase(), 
        correoUsuario: formData.correoUsuario.trim(),
        telefonoUsuario: formData.telefonoUsuario || null,
        regionUsuario: formData.regionUsuario,
        comunaUsuario: formData.comunaUsuario,
        direccionUsuario: formData.direccionUsuario,
        passwordUsuario: formData.passwordUsuario,
        codigoDescuentoUsuario: formData.codigoDescuentoUsuario || null,
        tipoUsuarioUsuario: 'cliente', 
    };

        try {
            const response = await axios.post(`${API_BASE_URL}/usuarios/save`, nuevoUsuarioPayload);
            const usuarioCreado = response.data;

            window.Swal.fire('¡Registro Exitoso!', `Bienvenid@ ${usuarioCreado.nombreUsuario}. Ya puedes iniciar sesión.`, 'success')
                .then(() => { navigate("/login"); });

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
                            <input type="text" name="nombreUsuario" placeholder="Nombre" value={formData.nombreUsuario} onChange={handleChange} required />
                            <input type="text" name="apellidosUsuario" placeholder="Apellidos" value={formData.apellidosUsuario} onChange={handleChange} required />
                        </div>
                        
                        <div className="fila-formulario">
                            <input type="date" name="fechaNacUsuario" placeholder="dd-mm-aaaa" value={formData.fechaNacUsuario} onChange={handleChange} />
                            <input type="text" name="rutUsuario" placeholder="RUT (sin puntos, con guión)" value={formData.rutUsuario} onChange={handleChange} required />
                        </div>
                        
                        <div className="fila-formulario">
                            <input type="email" name="correoUsuario" placeholder="Correo electrónico" value={formData.correoUsuario} onChange={handleChange} required />
                            <input type="tel" name="telefonoUsuario" placeholder="Teléfono (ej: 912345678)" value={formData.telefonoUsuario} onChange={handleChange} />
                        </div>
                        
                        <div className="fila-formulario">
                             <select name="regionUsuario" value={formData.regionUsuario} onChange={handleChange} disabled={!isScriptLoaded} required>
                                 <option value="" disabled>Seleccione Región</option>
                                 {isScriptLoaded && Object.keys(comunasPorRegion).map(regionKey => (
                                     <option key={regionKey} value={regionKey}>{regionKey.charAt(0).toUpperCase() + regionKey.slice(1).replace('_', ' ')}</option>
                                 ))}
                            </select>
                            <select name="comunaUsuario" value={formData.comunaUsuario} onChange={handleChange} disabled={!formData.regionUsuario || comunasDisponibles.length === 0} required>
                                 <option value="" disabled>Seleccione Comuna</option>
                                 {comunasDisponibles.map(com => ( <option key={com} value={com}>{com}</option> ))}
                            </select>
                        </div>

                        <div className="fila-formulario">
                            <input type="text" name="direccionUsuario" placeholder="Dirección completa" value={formData.direccionUsuario} onChange={handleChange} required />
                        </div>
                        
                        <div className="fila-formulario">
                            <input type="password" name="passwordUsuario" placeholder="Contraseña" value={formData.passwordUsuario} onChange={handleChange} required />
                            <input type="password" name="confirmarUsuario" placeholder="Confirmar Contraseña" value={formData.confirmarUsuario} onChange={handleChange} required />
                        </div>

                        <div className="fila-formulario" style={{justifyContent: 'center'}}>
                            <input type="text" name="codigoDescuentoUsuario" placeholder="Código de descuento (opcional)" value={formData.codigoDescuentoUsuario} onChange={handleChange} style={{width: '70%'}}/>
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