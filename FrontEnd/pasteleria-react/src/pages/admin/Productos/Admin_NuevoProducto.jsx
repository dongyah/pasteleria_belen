import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Admin_BarraLateral from '../Admin_BarraLateral'; 
import axios from 'axios';
import Swal from 'sweetalert2'; 

import '../../../styles/Admin.css';
import '../../../styles/Admin_NuevoProducto.css'; 

const API_BASE_URL = 'http://localhost:8015/api/v1'; 

const initialProductState = {
    codigo_producto: '',
    nombre_producto: '',
    precio_producto: '',
    stock_producto: '',
    stock_critico_producto: '',
    descripcion_producto: '',
    imagen: null, 
    nombreCategoriaProducto: '',
};

function Admin_NuevoProducto() {
    const navigate = useNavigate();
    const [productoData, setProductoData] = useState(initialProductState);
    const [categorias, setCategorias] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cargandoCategorias, setCargandoCategorias] = useState(true);

    // --- 1. Cargar Categorías (Para llenar el Dropdown) ---
    useEffect(() => {
        const fetchCategorias = async () => {
            setCargandoCategorias(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/categorias/all`);
                
                if (Array.isArray(response.data)) {
                    setCategorias(response.data);
                }
            } catch (error) {
                console.error("Error al cargar categorías:", error.response || error);
                Swal.fire('Error', 'No se pudieron cargar las categorías del servidor.', 'error');
            } finally {
                setCargandoCategorias(false);
            }
        };
        fetchCategorias();
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        if (name === 'nombreCategoriaProducto') {
            setProductoData(prev => ({ ...prev, [name]: value }));
        } else {
            let val;
            if (type === 'number') {
                val = value === '' ? '' : Number(value);
            } else {
                val = value;
            }
            setProductoData(prev => ({ ...prev, [name]: val }));
        }
    };

    const handleImageChange = (e) => {
        setProductoData(prev => ({ ...prev, imagen: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Validaciones
        if (!productoData.nombre_producto || !productoData.nombreCategoriaProducto || !productoData.precio_producto || productoData.precio_producto <= 0) {
            Swal.fire('Error', 'Por favor, complete todos los campos obligatorios (Nombre, Precio, Categoría).', 'warning');
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem('jwtToken') || localStorage.getItem('authToken');
        const userRole = localStorage.getItem('userRole') || localStorage.getItem('roleUsuario');
        
        console.log('Token disponible:', token ? 'Sí' : 'NO - ERROR');
        console.log('Rol del usuario:', userRole);
        console.log('Token (primeros 50 caracteres):', token ? token.substring(0, 50) + '...' : 'NINGUNO');

        if (!token) {
            Swal.fire('Error', 'No hay token disponible. Por favor, inicia sesión nuevamente.', 'error');
            setIsSubmitting(false);
            return;
        }

        if (!userRole || (userRole !== 'ADMIN' && userRole !== 'VENDEDOR')) {
            Swal.fire('Error', `Tu rol es: ${userRole}. Solo ADMIN y VENDEDOR pueden crear productos.`, 'error');
            setIsSubmitting(false);
            return;
        }

        // 2. Construir FormData
        const formData = new FormData();
        
        formData.append('codigo_producto', productoData.codigo_producto || '');
        formData.append('nombre_producto', productoData.nombre_producto);
        formData.append('precio_producto', productoData.precio_producto);
        formData.append('stock_producto', productoData.stock_producto || 0);
        formData.append('stock_critico_producto', productoData.stock_critico_producto || 0);
        formData.append('descripcion_producto', productoData.descripcion_producto);
        formData.append('nombreCategoriaProducto', productoData.nombreCategoriaProducto);

        if (productoData.imagen) {
             formData.append('imagen', productoData.imagen);
        }
        
        try {
            // POST: /api/v1/productos/save
            const response = await axios.post(`${API_BASE_URL}/productos/save`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                }
            });

            Swal.fire('¡Creado!', 'El producto ha sido guardado exitosamente.', 'success');
            setProductoData(initialProductState); 
            navigate('/admin/productos');

        } catch (error) {
            console.error("Error al guardar producto:", error.response || error);
            
            let errorMsg = 'Error al guardar el producto. Verifique la conexión o el formato de datos.';
             if (error.response && error.response.status === 403) {
                errorMsg = 'Acceso denegado (403). Verifica que:\n1. Tu usuario sea ADMIN\n2. El token no haya expirado\n3. Cierra sesión y vuelve a iniciar.';
            } else if (error.response && error.response.status === 400) {
                 errorMsg = 'Error 400: Datos incompletos o mal formateados (JSON, Image o ID).';
            }
            Swal.fire('Error', errorMsg, 'error');
            
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="admin-layout">
            <Admin_BarraLateral />
            <div className="contenido-principal">
                <main className="admin-contenido">
                    
                    <div className="volver-atras-container">
                        <Link to="/admin/productos" className="volver-atras-link">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Volver a Gestión de Productos
                        </Link>
                    </div>

                    <h1 className="titulo-admin">Nuevo Producto</h1>
                    <section className="seccion-formulario">
                        
                        <form className="formulario-usuario producto" onSubmit={handleSubmit}>
                            
                            <div className="fila-formulario">
                                <input type="text" name="codigo_producto" placeholder="Código Producto" value={productoData.codigo_producto} onChange={handleChange} required />
                                <input type="text" name="nombre_producto" placeholder="Nombre Producto *" value={productoData.nombre_producto} onChange={handleChange} required />
                            </div>
                            
                            <textarea 
                                name="descripcion_producto" 
                                placeholder="Descripción del Producto" 
                                value={productoData.descripcion_producto} 
                                onChange={handleChange} 
                            />
                            
                            <div className="fila-formulario">
                                <input 
                                    type="number" 
                                    name="precio_producto" 
                                    placeholder="Precio (CLP) *" 
                                    value={productoData.precio_producto} 
                                    onChange={handleChange} 
                                    min="1" 
                                    required 
                                />
                                <input 
                                    type="number" 
                                    name="stock_producto" 
                                    placeholder="Stock Actual (Entero) *" 
                                    value={productoData.stock_producto} 
                                    onChange={handleChange} 
                                    min="0" 
                                    required 
                                />
                                <input 
                                    type="number" 
                                    name="stock_critico_producto" 
                                    placeholder="Stock Crítico (Alerta)" 
                                    value={productoData.stock_critico_producto} 
                                    onChange={handleChange} 
                                    min="0" 
                                />
                            </div>
                            
                            <div className="fila-formulario">
                                
                                <select 
                                    name="nombreCategoriaProducto" 
                                    value={productoData.nombreCategoriaProducto} 
                                    onChange={handleChange} 
                                    disabled={cargandoCategorias}
                                    required
                                >
                                    <option value="">
                                        {cargandoCategorias ? 'Cargando Categorías...' : 'Seleccione Categoría *'}
                                    </option>
                                    {categorias.map(cat => (
                                        <option 
                                            key={cat.idCategoria} 
                                            value={cat.nombreCategoria}
                                        >
                                            {cat.nombreCategoria}
                                        </option>
                                    ))}
                                </select>
                                
                                <input type="file" name="imagen" accept="image/*" onChange={handleImageChange} />
                            </div>

                            <div className="acciones-formulario">
                                <button type="submit" className="btn-guardar" disabled={isSubmitting}>
                                    {isSubmitting ? 'Guardando Producto...' : 'Guardar Producto'}
                                </button>
                            </div>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Admin_NuevoProducto;