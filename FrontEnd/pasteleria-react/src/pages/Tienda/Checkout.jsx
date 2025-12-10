import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useCart } from "../../context/CartContext";
import BarraNav from "./BarraNav";
import Footer from "./Footer";
import Swal from 'sweetalert2';

// 🔑 CORRECCIÓN DE RUTA
const API_BASE_URL = "http://localhost:8015/api/v1"; 
const comunasPorRegion = window.comunasPorRegion || {}; 

function Checkout() {
    const { cart, total, clearCart } = useCart();
    const navigate = useNavigate();
    
    const userId = localStorage.getItem('userId');
    
    const [clienteData, setClienteData] = useState({
        nombre: '', apellidos: '', correo: '',
        rut: '', 
        telefono: '', 
        calle: '', departamento: '', region: '', comuna: '',
        indicaciones: '',
        usuarioId: userId ? Number(userId) : null, 
    });
    
    const [comunasDisponibles, setComunasDisponibles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUserLoaded, setIsUserLoaded] = useState(false);

    // --- EFECTO 1: Cargar Datos del Usuario Logueado (FIX de TypeError) ---
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        
        if (token && clienteData.usuarioId && !isUserLoaded) {
            const fetchUserProfile = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/usuarios/find/${clienteData.usuarioId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    const userProfile = response.data;
                    
                    // 🔑 FIX FRONTAL: Verificar que userProfile no sea null/undefined. 
                    if (userProfile) { 
                        setClienteData(prev => ({
                            ...prev,
                            nombre: userProfile.nombreUsuario || prev.nombre,
                            apellidos: userProfile.apellidosUsuario || prev.apellidos,
                            correo: userProfile.correoUsuario || prev.correo,
                            rut: userProfile.rutUsuario || prev.rut, 
                            telefono: userProfile.telefonoUsuario || prev.telefono, 
                            calle: userProfile.direccionUsuario || prev.calle, 
                            region: userProfile.regionUsuario || prev.region,
                            comuna: userProfile.comunaUsuario || prev.comuna,
                        }));
                    } else {
                         console.warn("Perfil de usuario logueado no encontrado o vacío en el backend.");
                    }
                    setIsUserLoaded(true);
                    
                } catch (error) {
                    console.error("Error al cargar perfil del usuario:", error);
                    setIsUserLoaded(true); 
                }
            };
            fetchUserProfile();
        } else if (!token && userId) {
             setIsUserLoaded(true); 
        }
    }, [clienteData.usuarioId, isUserLoaded]);
    
    // --- EFECTO 2: Lógica de Comunas y Regiones ---
    useEffect(() => {
        if (clienteData.region && comunasPorRegion) {
            setComunasDisponibles(comunasPorRegion[clienteData.region] || []);
        } else {
            setComunasDisponibles([]);
        }
    }, [clienteData.region]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClienteData(prev => ({ ...prev, [name]: value }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        
        // Validaciones de campos obligatorios 
        const requiredFields = ['nombre', 'apellidos', 'correo', 'rut', 'telefono', 'calle', 'region', 'comuna'];
        const isValid = requiredFields.every(field => clienteData[field] && clienteData[field].trim() !== '');

        if (!isValid) {
            Swal.fire('Datos Faltantes', 'Por favor, complete todos los campos obligatorios (*).', 'warning');
            return;
        }
        if (cart.length === 0) {
             Swal.fire('Carrito Vacío', 'Agregue productos a su carrito antes de pagar.', 'warning');
             return;
        }

        setIsProcessing(true);
        
        // 🔑 FIX BACKEND: Convertimos el total a Integer (entero)
        const totalInt = Math.round(total);
        
        // 1. CONSTRUCCIÓN DEL DTO OrderRequest PARA EL BACKEND
        const orderRequestPayload = {
            usuarioId: clienteData.usuarioId, 
            total: totalInt, 
            
            // DTO ClienteDataDTO
            cliente: {
                nombre: clienteData.nombre,
                apellidos: clienteData.apellidos,
                correo: clienteData.correo,
                rut: clienteData.rut,
                telefono: clienteData.telefono,
                calle: clienteData.calle,
                departamento: clienteData.departamento,
                region: clienteData.region,
                comuna: clienteData.comuna,
                indicaciones: clienteData.indicaciones,
            },
            
            // DTO ProductoItemDTO[]
            productos: cart.map(item => ({
                productoNombre: item.nombre,
                productoId: item.id, 
                cantidad: item.cantidad,
                precioUnitario: item.precio
            })),
        };

        try {
            // 2. LLAMADA REAL AL ENDPOINT DE CREACIÓN DE ORDENES
            const response = await axios.post(`${API_BASE_URL}/ordenes/create`, orderRequestPayload);
            
            const orderId = response.data.idOrden; 
            
            clearCart();
            Swal.fire('Pago Exitoso', `Su orden #${orderId} ha sido confirmada.`, 'success')
                .then(() => {
                    navigate(`/confirmacion/${orderId}`, { state: { cliente: clienteData, total: total, cart: cart } });
                });


        } catch (error) {
            console.error("Error al procesar la orden:", error.response || error);
            let errorText = 'Hubo un problema al procesar su pago. Verifique el servidor.';
            
            if (error.response && error.response.status === 403) {
                // Si ves este error, DEBES REINICIAR el servidor Spring Boot
                errorText = 'Acceso Denegado (403): El servidor no permite la compra de invitados. ¡Reinicie el Backend!';
            } else if (error.response && error.response.status === 500) {
                 errorText = 'Error interno (500): Verifique logs por Constraint Violation o la falta de @Builder en Orden.java';
            } else if (error.response && error.response.data && typeof error.response.data === 'string') {
                errorText = error.response.data;
            }
            
            Swal.fire('Error de Pago', errorText, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

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
                                        <span className="item-price">${(item.precio * item.cantidad).toLocaleString()} CLP</span>
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
                            <div className="input-group-row">
                                <input type="text" name="rut" placeholder="RUT *" value={clienteData.rut} onChange={handleChange} required />
                                <input type="tel" name="telefono" placeholder="Teléfono *" value={clienteData.telefono} onChange={handleChange} required />
                            </div>
                            <input type="email" name="correo" placeholder="Correo *" value={clienteData.correo} onChange={handleChange} required className="full-width-input" />
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
                                <select name="region" value={clienteData.region} onChange={handleChange} required className="form-control-select">
                                    <option value="">Seleccionar Región *</option>
                                    {Object.keys(comunasPorRegion).map(regionKey => (
                                        <option key={regionKey} value={regionKey}>
                                            {regionKey.charAt(0).toUpperCase() + regionKey.slice(1).replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                                <select name="comuna" value={clienteData.comuna} onChange={handleChange} disabled={!clienteData.region} required className="form-control-select">
                                    <option value="">Seleccionar Comuna *</option>
                                    {comunasDisponibles.map(com => (
                                        <option key={com} value={com}>{com}</option>
                                    ))}
                                </select>
                            </div>
                            <textarea name="indicaciones" placeholder="Indicaciones para la entrega (ej: timbre no funciona, dejar en conserjería)" value={clienteData.indicaciones} onChange={handleChange} className="full-width-input"></textarea>
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