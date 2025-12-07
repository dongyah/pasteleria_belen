import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../../styles/all.css";
import BarraNav from "./BarraNav";
import Footer from "./Footer";

// URL base del backend
const API_BASE_URL = "http://localhost:8015/api/v1"; 

function Login() {
    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
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
        const loginPayload = {
            correo: correo, // Tu backend usa 'correo'
            password: password
        };
        
        // Endpoint que asumimos en UsuarioController.java (ej. /api/usuarios/login)
        let loginEndpoint = `${API_BASE_URL}/usuarios/login`; 
        
        try {
            // 2. Llamada POST al endpoint de LOGIN
            const response = await axios.post(loginEndpoint, loginPayload);
            const data = response.data; // Objeto Usuario devuelto por Spring Boot

            // 3. Obtener el rol y normalizarlo
            const userRole = data.tipoUsuario.toLowerCase();

            // 4. Guardar la sesión en localStorage 
            localStorage.setItem(
                "usuarioActual",
                JSON.stringify({
                    nombre: data.nombre,
                    correo: data.correo,
                    tipo: userRole, 
                })
            );
            
            // 5. Notificación y Redirección
            window.Swal.fire('¡Bienvenido!', `Hola ${data.nombre}.`, 'success')
                .then(() => {
                    if (userRole === 'administrador' || userRole === 'vendedor') {
                         navigate("/admin"); // Redirige a la administración
                    } else {
                         navigate("/"); // Redirige al inicio para clientes
                    }
                });
            
        } catch (error) {
            console.error("Error de login:", error.response || error);
            
            // Mostrar error de credenciales con SweetAlert2
            window.Swal.fire({
                icon: 'error',
                title: 'Fallo al iniciar sesión',
                text: 'Correo o contraseña incorrectos. Verifica tus credenciales y el estado del servidor.'
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
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />

                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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