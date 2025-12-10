import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Admin_BarraLateral from '../Admin_BarraLateral'; 
import axios from 'axios'; 
import '../../../styles/Admin.css';
import '../../../styles/Admin_Gestion.css';


const API_BASE_URL = 'http://localhost:8015/api/v1'; 

function Admin_GestionProductos() {

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);


    const fetchProductos = async () => {
        setCargando(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/productos/all`);
            
            setProductos(response.data);
        } catch (err) {
            console.error("Error al cargar productos:", err.response || err);
            
            let errorMsg = "Error al conectar con el servidor o cargar productos.";
            if (err.response && err.response.status === 404) {
                 errorMsg = "Error 404: La ruta /api/v1/productos/all no fue encontrada en Spring Boot.";
            } else if (err.response && err.response.status === 403) {
                 errorMsg = "Error 403: Acceso denegado (Problema de autenticación/CORS).";
            }
            setError(errorMsg);
        } finally {
            setCargando(false);
        }
    };
    
    useEffect(() => {
        fetchProductos(); 
    }, []); 
    
    const handleDelete = async (idProducto) => {
        if (!window.confirm(`¿Estás seguro de eliminar el producto con ID ${idProducto}?`)) {
            return;
        }

        try {

            await axios.delete(`${API_BASE_URL}/productos/delete/${idProducto}`); 
            
            setProductos(productos.filter(p => p.id !== idProducto)); 
            
            window.alert('Producto eliminado correctamente.');

        } catch (err) {
            console.error("Error al eliminar:", err.response || err);
            window.alert('Error al eliminar el producto. Revise la API DELETE.');
        }
    };
    

    const formatPrice = (price) => {
        if (price === null || price === undefined) return '$0 CLP';
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
    };


    if (cargando) {
        return (
            <div className="admin-layout">
                <Admin_BarraLateral />
                <div className="contenido-principal"><p className="text-center mt-5">Cargando productos desde el Backend...</p></div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="admin-layout">
                <Admin_BarraLateral />
                <div className="contenido-principal"><p className="text-center mt-5 text-danger">Error: {error}</p></div>
            </div>
        );
    }
    

    return (
        <div className="admin-layout">
            <Admin_BarraLateral />
            <div className="contenido-principal">
                <main className="admin-contenido p-4">
                    <div className="card shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Gestión de Productos ({productos.length} Registrados)</h5>
                            <Link to="/admin/nuevo-producto" className="btn btn-primary">Nuevo Producto</Link>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="text-center">ID</th>
                                            <th scope="col">Código</th>
                                            <th scope="col">Nombre</th>
                                            <th scope="col">Descripción</th>
                                            <th scope="col" className="text-end">Precio</th>
                                            <th scope="col" className="text-center">Stock</th>
                                            <th scope="col" className="text-center">Stock Crítico</th>
                                            <th scope="col">Categoría</th>
                                            <th scope="col" className="text-center">Imagen</th>
                                            <th scope="col" className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productos.length > 0 ? (
                                            productos.map(producto => (
                                                <tr key={producto.id || producto.idProducto}> 
                                                    <td className="text-center">{producto.id || producto.idProducto}</td> 
                                                    
                                                    <td>{producto.codigoProducto}</td>
                                                    <td>{producto.nombreProducto}</td>
                                                    <td>{producto.descripcionProducto && producto.descripcionProducto.length > 50 ? `${producto.descripcionProducto.substring(0, 50)}...` : producto.descripcionProducto}</td>
                                                    <td className="text-end">{formatPrice(producto.precioProducto)}</td>
                                                    <td className="text-center">{producto.stockProducto}</td>
                                                    <td className="text-center">
                                                        {producto.stockCriticoProducto && producto.stockProducto <= producto.stockCriticoProducto && producto.stockCriticoProducto > 0 ? (
                                                             <span className="badge bg-danger">¡CRÍTICO! ({producto.stockCriticoProducto})</span>
                                                         ) : (
                                                             producto.stockCriticoProducto || '-'
                                                         )}
                                                     </td>
                                                    <td>{producto.nombreCategoria}</td>
                                                    <td className="text-center">
                                                         {producto.imagenProducto ? 
                                                             <img src={producto.imagenProducto} alt={producto.nombreProducto} style={{ height: '30px', width: 'auto', objectFit: 'cover' }} />
                                                             : 'N/A'
                                                         }
                                                     </td>
                                                    
                                                    <td className="text-center">
                                                         <Link to={`/admin/editar-producto/${producto.id || producto.idProducto}`} className="btn btn-sm btn-primary me-2">Editar</Link>
                                                         <button 
                                                             className="btn btn-sm btn-danger"
                                                             onClick={() => handleDelete(producto.id || producto.idProducto)} 
                                                         >
                                                             Eliminar
                                                         </button>
                                                     </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="text-center text-muted">No hay productos registrados en el servidor.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-center" id="paginacionProductos">
                            <p className="text-muted small">Mostrando {productos.length} productos.</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Admin_GestionProductos;