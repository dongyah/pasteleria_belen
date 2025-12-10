import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import BarraNav from "./BarraNav";
import Footer from "./Footer";
import Swal from 'sweetalert2';

function Confirmacion() {
    const { orderId } = useParams();
    const location = useLocation();
    
    const { cliente, total, cart } = location.state || { cliente: {}, total: 0, cart: [] };

    const handleAction = (type) => {
        const actionText = type === 'pdf' ? 'Imprimiendo boleta en PDF' : 'Enviando boleta por correo';
        Swal.fire('Acción Ejecutada', `${actionText}. ID de Orden: ${orderId}`, 'success');
    };

    return (
        <>
            <BarraNav />
            <main className="confirmacion-main">
                <div className="confirmacion-box">
                    <h1 className="confirmacion-title">✅ Se ha realizado el pedido nro. #{orderId}</h1>
                    <p className="confirmacion-subtitle">Gracias por su compra. Complete la siguiente información de contacto y envío.</p>
                    
                    <div className="info-resumen-seccion">
                        <h2>Información del Cliente</h2>
                        <div className="info-row">
                            <span>Nombre:</span> <strong>{cliente.nombre}</strong>
                            <span>Apellidos:</span> <strong>{cliente.apellidos}</strong>
                            <span>Correo:</span> <strong>{cliente.correo}</strong>
                        </div>

                        <h2>Dirección de Entrega</h2>
                        <div className="info-row full-width">
                            <span>Calle:</span> <strong>{cliente.calle}</strong>
                            <span>Depto/Casa:</span> <strong>{cliente.departamento || 'N/A'}</strong>
                            <span>Región:</span> <strong>{cliente.region.replace('_', ' ')}</strong>
                            <span>Comuna:</span> <strong>{cliente.comuna}</strong>
                        </div>
                        <p className="indicaciones-texto">
                            Indicaciones para la entrega (opcional): {cliente.indicaciones || 'No hay indicaciones adicionales.'}
                        </p>
                    </div>

                    <div className="resumen-productos-seccion">
                        <h2>Productos Comprados</h2>
                        <table className="tabla-orden">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.nombre}</td>
                                        <td>${item.precio.toLocaleString()}</td>
                                        <td>{item.cantidad}</td>
                                        <td>${(item.precio * item.cantidad).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="total-label">Total pagado:</td>
                                    <td className="total-amount-final">${total.toLocaleString()} CLP</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="acciones-finales">
                        <button className="btn btn-pdf" onClick={() => handleAction('pdf')}>
                            Imprimir boleta en PDF
                        </button>
                        <button className="btn btn-email" onClick={() => handleAction('email')}>
                            Enviar boleta por email
                        </button>
                    </div>

                </div>
            </main>
            <Footer />
        </>
    );
}

export default Confirmacion;