// src/pages/admin/ordenes/Admin_MostrarBoleta.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Admin_BarraLateral from '../Admin_BarraLateral';
import '../../../styles/Admin.css'; 
import '../../../styles/Admin_Gestion.css';

const API_BASE_URL = 'http://localhost:8015/api/v1'; 

function Admin_MostrarBoleta() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [orden, setOrden] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const fetchDetalleOrden = async () => {
        setCargando(true);
        setError(null);
        
        if (!id || isNaN(Number(id))) {
            setError("ID de Orden inválido.");
            setCargando(false);
            return;
        }

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/ordenes/find/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            setOrden(response.data);

        } catch (err) {
            console.error("Error al cargar la boleta:", err.response || err);
            let errorMsg = `Orden #${id} no encontrada. Verifique ID o su rol (ADMIN/VENDEDOR).`;
            
            if (err.response && (err.response.status === 403 || err.response.status === 401)) {
                errorMsg = "Acceso denegado (403). Rol insuficiente para ver el detalle de la orden.";
            } else if (err.response && err.response.status === 404) {
                errorMsg = `Orden #${id} no existe.`;
            }
            
            Swal.fire('Error', errorMsg, 'error');
            setError(errorMsg);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchDetalleOrden();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-CL', options);
    };

    if (cargando) {
        return (
            <div className="admin-layout">
                <Admin_BarraLateral />
                <div className="contenido-principal"><p className="text-center mt-5">Cargando detalles de la orden...</p></div>
            </div>
        );
    }
    
    if (error || !orden) {
        return (
            <div className="admin-layout">
                <Admin_BarraLateral />
                <div className="contenido-principal">
                    <p className="text-center mt-5 text-danger">{error || "No se pudo cargar la orden."}</p>
                    <Link to="/admin/ordenes" className="btn btn-primary mt-3">Volver al Listado</Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="admin-layout">
            <Admin_BarraLateral />
            <div className="contenido-principal p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="titulo-admin">Detalle de la Orden N° {orden.idOrden}</h1>
                    <div>
                        <button onClick={handlePrint} className="btn btn-secondary me-2">Imprimir / PDF</button>
                        <Link to="/admin/ordenes" className="btn btn-primary">Volver al Listado</Link>
                    </div>
                </div>

                {/* Usaremos la clase .boleta-print-area para darle estilos en Admin.css */}
                <div className="card shadow-sm boleta-print-area">
                    <div className="card-body p-4">
                        
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <img src="/img/logo_pasteleria.png" alt="Logo Pastelería" style={{ width: '80px' }} />
                                <h4 className="mt-2">Pastelería Mil Sabores</h4>
                                <p className="mb-0">Estado: <strong>{orden.estado}</strong></p>
                            </div>
                            <div className="col-md-6 text-end">
                                <h3>BOLETA</h3>
                                <p className="mb-1"><strong>N°:</strong> {orden.idOrden}</p>
                                <p className="mb-0"><strong>Fecha:</strong> {formatDate(orden.fechaCompra)}</p>
                            </div>
                        </div>
                        <hr />

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <h5>Datos del Cliente</h5>
                                <p className="mb-1"><strong>Nombre:</strong> {orden.nombreCliente}</p>
                                <p className="mb-1"><strong>Correo:</strong> {orden.correoCliente}</p>
                                <p className="mb-0"><strong>ID Usuario:</strong> {orden.usuarioId || 'Invitado'}</p>
                            </div>
                            <div className="col-md-6">
                                <h5>Dirección de Envío</h5>
                                <p className="mb-1">{orden.direccionEnvio}</p>
                                {orden.indicaciones && <p className="mb-0 small text-muted">Indicaciones: {orden.indicaciones}</p>}
                            </div>
                        </div>
                        
                        <table className="table table-bordered table-sm">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col" className="text-end">Precio Unit.</th>
                                    <th scope="col" className="text-end">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orden.items && orden.items.map(item => (
                                    <tr key={item.productoId}>
                                        <td>{item.cantidad}</td>
                                        <td>{item.nombreProducto}</td>
                                        <td className="text-end">${item.precioUnitario.toLocaleString('es-CL')}</td>
                                        <td className="text-end">${(item.cantidad * item.precioUnitario).toLocaleString('es-CL')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="row justify-content-end mt-4">
                            <div className="col-md-4">
                                <ul className="list-group">
                                    <li className="list-group-item d-flex justify-content-between">
                                        Subtotal:
                                        <span>${orden.total.toLocaleString('es-CL')}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between list-group-item-success">
                                        <h4>Total Pagado:</h4>
                                        <h4>${orden.total.toLocaleString('es-CL')}</h4>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin_MostrarBoleta;