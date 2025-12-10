import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../../styles/all.css";
import BarraNav from "./BarraNav";
import Footer from "./Footer";
import Swal from 'sweetalert2'; 

// URL base del backend
const API_BASE_URL = "http://localhost:8015/api/v1"; 

function Login() {
    const navigate = useNavigate();

    // NOTA: Usamos correoUsuario y passwordUsuario para consistencia con el backend DTO
    const [correoUsuario, setCorreoUsuario] = useState("");
    const [passwordUsuario, setPasswordUsuario] = useState("");
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);


    // --- EFECTO: Carga de SweetAlert2 ---
    useEffect(() => {
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isScriptLoaded) {
            window.alert("Error: Las herramientas de notificación no están listas."); 
            return;
        }

        // 1. Crear el payload de login (AuthenticationRequest)
        // Usamos las claves que el backend espera del DTO de autenticación
        const loginPayload = {
            // Basado en tu prueba de Postman (image_cbd4e0.png), el backend espera:
            correoUsuario: correoUsuario, 
            passwordUsuario: passwordUsuario
        };
        
        // 🔑 CORRECCIÓN: Usar el endpoint de autenticación JWT
        let loginEndpoint = `${API_BASE_URL}/auth/authenticate`; 
        
        try {
            // 2. Llamada POST al endpoint de AUTENTICACIÓN
            const response = await axios.post(loginEndpoint, loginPayload);
            
            // 🔑 CLAVE: La respuesta contiene el token, ID y role
            const { token, idUsuario, role } = response.data; 

            // 3. Normalizar el rol para la lógica de redirección
            const userRole = role.toUpperCase(); // Usar mayúsculas: ADMIN, VENDEDOR, CLIENTE

            // 4. Guardar la sesión en localStorage (JWT, ID y Rol)
            localStorage.setItem("jwtToken", token);
            localStorage.setItem("userId", idUsuario);
            localStorage.setItem("userRole", userRole);
            
            // 5. Opcional: Configurar el token para TODAS las futuras peticiones de Axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // 6. Notificación y Redirección CONDICIONAL
            window.Swal.fire('¡Bienvenido!', `Has iniciado sesión como ${userRole}.`, 'success')
                .then(() => {
                    // Requerimiento de Evaluación 3: Redirección por Rol
                    if (userRole === 'ADMIN') {
                        navigate("/admin"); 
                    } else if (userRole === 'VENDEDOR') {
                        navigate("/admin/productos"); 
                    } else { // Cliente
                        navigate("/"); 
                    }
                });
            
        } catch (error) {
            console.error("Error de login:", error.response || error);
            
            // Mostrar error si es 401 (Credenciales inválidas)
            let errorText = 'Ocurrió un error. Verifica el estado del servidor.';
            if (error.response && error.response.status === 401) {
                 errorText = 'Correo o contraseña incorrectos. Verifica tus credenciales.';
            }

            window.Swal.fire({
                icon: 'error',
                title: 'Fallo al iniciar sesión',
                text: errorText
            });
        }
    };

    return (
        <>
            <BarraNav />
            <div className="overlay">
                <div className="recuadro">
                    <div className="presentacion">
                        <h1>Iniciar Sesión</h1>
                        <p>¿No tienes cuenta todavía?</p>
                        <a href="/registro">Regístrate aquí</a>
                    </div>

                    <form className="form-inis" onSubmit={handleSubmit}>
                        <label htmlFor="correo">Correo electrónico</label>
                        <input
                            type="email"
                            id="correo"
                            value={correoUsuario} // Usar el estado correcto
                            onChange={(e) => setCorreoUsuario(e.target.value)}
                            required
                        />

                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={passwordUsuario} // Usar el estado correcto
                            onChange={(e) => setPasswordUsuario(e.target.value)}
                            required
                        />

                        <button type="submit" disabled={!isScriptLoaded}>Iniciar sesión</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Login;