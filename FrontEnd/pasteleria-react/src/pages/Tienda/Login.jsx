import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../../styles/all.css";
import BarraNav from "./BarraNav";
import Footer from "./Footer";
import Swal from 'sweetalert2'; 

const API_BASE_URL = "http://localhost:8015/api/v1"; 

function Login() {
    const navigate = useNavigate();
    const [correoUsuario, setCorreoUsuario] = useState("");
    const [passwordUsuario, setPasswordUsuario] = useState("");
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

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

        const loginPayload = {
            correoUsuario: correoUsuario, 
            passwordUsuario: passwordUsuario
        };
        
        let loginEndpoint = `${API_BASE_URL}/auth/authenticate`; 
        
        try {
            const response = await axios.post(loginEndpoint, loginPayload);
            
            const { token, idUsuario, role } = response.data; 

            const userRole = role.toUpperCase(); 

            localStorage.setItem("jwtToken", token);
            localStorage.setItem("userId", idUsuario);
            localStorage.setItem("userRole", userRole);
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            window.Swal.fire('¡Bienvenido!', `Has iniciado sesión como ${userRole}.`, 'success')
                .then(() => {
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
                            value={correoUsuario} 
                            onChange={(e) => setCorreoUsuario(e.target.value)}
                            required
                        />

                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={passwordUsuario} 
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