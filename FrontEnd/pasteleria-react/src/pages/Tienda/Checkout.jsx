import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useCart } from "../../context/CartContext";
import BarraNav from "./BarraNav";
import Footer from "./Footer";
import Swal from 'sweetalert2';

// URL base del backend
const API_BASE_URL = "http://localhost:8015/api"; 
const comunasPorRegion = window.comunasPorRegion || {}; 

function Checkout() {
    const { cart, total, clearCart } = useCart();
    const navigate = useNavigate();
    
    // Asumimos que esta info existe si el usuario está logueado
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioActual')); 
    
    const [clienteData, setClienteData] = useState({
        nombre: '', apellidos: '', correo: '',
        calle: '', departamento: '', region: '', comuna: '',
        indicaciones: '',
        // CLAVE: Incluir el ID del usuario si está logueado
        usuarioId: usuarioLogueado ? usuarioLogueado.id : null,
    });
    
    const [comunasDisponibles, setComunasDisponibles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUserLoaded, setIsUserLoaded] = useState(false);

    // --- EFECTO 1: Cargar Datos del Usuario Logueado ---
    useEffect(() => {
        if (usuarioLogueado && usuarioLogueado.correo && !isUserLoaded) {
            // Suponemos que tienes un endpoint para obtener el perfil completo
            const fetchUserProfile = async () => {
                try {
                    // LLamada al backend para obtener todos los datos de dirección y nombre del usuario logueado
                    // Endpoint necesario en tu backend: GET /api/usuarios/perfil/{correo}
                    const response = await axios.get(`${API_BASE_URL}/usuarios/perfil/${usuarioLogueado.correo}`);
                    const userProfile = response.data;
                    
                    // 1. Rellenar campos de contacto y dirección
                    setClienteData(prev => ({
                        ...prev,
                        nombre: userProfile.nombre || prev.nombre,
                        apellidos: userProfile.apellidos || prev.apellidos,
                        correo: userProfile.correo || prev.correo,
                        calle: userProfile.direccion || prev.calle, // Mapeamos 'direccion' a 'calle'
                        region: userProfile.region || prev.region,
                        comuna: userProfile.comuna || prev.comuna,
                        // ID ya está en el estado inicial
                    }));
                    setIsUserLoaded(true);
                } catch (error) {
                    console.error("Error al cargar perfil del usuario:", error);
                    setIsUserLoaded(true); // Evita reintentos fallidos
                }
            };
            fetchUserProfile();
        }
    }, [usuarioLogueado, isUserLoaded]);
    
    // --- EFECTO 2: Lógica de Comunas y Regiones (se mantiene) ---
    useEffect(() => {
        // ... (Tu lógica para actualizar comunas) ...
        if (clienteData.region && comunasPorRegion) {
            setComunasDisponibles(comunasPorRegion[clienteData.region] || []);
        } else {
            setComunasDisponibles([]);
        }
        // Ojo: No resetear la comuna si ya estaba cargada por el perfil
        // setClienteData(prev => ({ ...prev, comuna: '' })); 
    }, [clienteData.region]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClienteData(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        
        // ... (Validaciones de campos obligatorios) ...
        const requiredFields = ['nombre', 'apellidos', 'correo', 'calle', 'region', 'comuna'];
        const isValid = requiredFields.every(field => clienteData[field].trim() !== '');

        if (!isValid) {
            Swal.fire('Datos Faltantes', 'Por favor, complete todos los campos de cliente y envío.', 'warning');
            return;
        }

        setIsProcessing(true);
        
        // --- PREPARACIÓN DE LA ORDEN PARA EL BACKEND (BOLETA/ORDEN DE COMPRA) ---
        const orderData = {
            // Si el cliente está logueado, se envía el ID para relacionar el historial
            usuarioId: clienteData.usuarioId, 
            // Datos del cliente y envío (que puede haber modificado)
            cliente: clienteData,
            // Productos del carrito
            productos: cart.map(item => ({
                productoNombre: item.nombre,
                productoId: item.id, // Suponemos que tus productos tienen ID
                cantidad: item.cantidad,
                precioUnitario: item.precio
            })),
            total: total,
            fecha: new Date().toISOString(),
            estado: 'Pagado - Pendiente de Envío' // Estado inicial
        };

        try {
            // Endpoint necesario en tu backend: POST /api/ordenes/crear
            // Asumimos que esta llamada crea la orden y genera el ID de boleta
            // const response = await axios.post(`${API_BASE_URL}/ordenes/crear`, orderData);
            // const orderId = response.data.orderId; // El backend devuelve el ID

            // *** SIMULACIÓN (Reemplazar con la llamada Axios) ***
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            const orderId = `ORDER${Math.floor(Math.random() * 900000) + 100000}`;
            // *************************************************

            clearCart();
            Swal.fire('Pago Exitoso', `Su orden #${orderId} ha sido confirmada.`, 'success')
                .then(() => {
                     // Pasamos los datos al componente de confirmación
                    navigate(`/confirmacion/${orderId}`, { state: { cliente: clienteData, total: total, cart: cart } });
                });


        } catch (error) {
            Swal.fire('Error de Pago', 'Hubo un problema al procesar su pago. Inténtelo de nuevo.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };
    
    // ... (JSX se mantiene igual, pero los inputs usan los valores y manejadores actualizados) ...

    return (
        <>
            <BarraNav />
            <main className="checkout-main">
                <form onSubmit={handlePayment} className="checkout-form-grid">
                    
                    {/* --- COLUMNA IZQUIERDA: RESUMEN Y DATOS --- */}
                    <div className="checkout-column">
                        <div className="checkout-section-box">
                            <h2 className="section-title-sm">1. Productos y Total</h2>
                            <div className="checkout-product-list">
                                {cart.map((item, index) => (
                                    <div key={index} className="checkout-item-row">
                                        <span className="item-name">{item.nombre}</span>
                                        <span className="item-qty">x{item.cantidad}</span>
                                        <span className="item-price">${(item.precio * item.cantidad).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="checkout-total-display">
                                Total a pagar: <span>${total.toLocaleString()} CLP</span>
                            </div>
                        </div>

                        <div className="checkout-section-box">
                            <h2 className="section-title-sm">2. Información del Cliente</h2>
                            <div className="input-group-row">
                                <input type="text" name="nombre" placeholder="Nombre *" value={clienteData.nombre} onChange={handleChange} required />
                                <input type="text" name="apellidos" placeholder="Apellidos *" value={clienteData.apellidos} onChange={handleChange} required />
                            </div>
                            <input type="email" name="correo" placeholder="Correo *" value={clienteData.correo} onChange={handleChange} required />
                            {clienteData.usuarioId && <p style={{fontSize: '0.85rem', color: '#007bff'}}>Datos cargados de su perfil.</p>}
                        </div>
                    </div>
                    
                    {/* --- COLUMNA DERECHA: DIRECCIÓN Y PAGO --- */}
                    <div className="checkout-column">
                         <div className="checkout-section-box">
                            <h2 className="section-title-sm">3. Dirección de Entrega</h2>
                            <div className="input-group-row">
                                <input type="text" name="calle" placeholder="Calle/Avenida y Número *" value={clienteData.calle} onChange={handleChange} required />
                                <input type="text" name="departamento" placeholder="Departamento/Casa (opcional)" value={clienteData.departamento} onChange={handleChange} />
                            </div>
                            <div className="input-group-row">
                                <select name="region" value={clienteData.region} onChange={handleChange} required>
                                    <option value="">Seleccionar Región *</option>
                                    {Object.keys(comunasPorRegion).map(regionKey => (
                                        <option key={regionKey} value={regionKey}>
                                            {regionKey.charAt(0).toUpperCase() + regionKey.slice(1).replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                                <select name="comuna" value={clienteData.comuna} onChange={handleChange} disabled={!clienteData.region} required>
                                    <option value="">Seleccionar Comuna *</option>
                                    {comunasDisponibles.map(com => (
                                        <option key={com} value={com}>{com}</option>
                                    ))}
                                </select>
                            </div>
                            <textarea name="indicaciones" placeholder="Indicaciones para la entrega (ej: timbre no funciona, dejar en conserjería)" value={clienteData.indicaciones} onChange={handleChange}></textarea>
                        </div>

                        <button type="submit" className="btn btn-pay-now" disabled={isProcessing}>
                            {isProcessing ? 'Procesando Pago...' : `Pagar ahora $${total.toLocaleString()} CLP`}
                        </button>
                    </div>

                </form>
            </main>
            <Footer />
        </>
    );
}

export default Checkout;