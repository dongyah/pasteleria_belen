import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { productos } from "../../data/productos"; // 🔑 Importar el mockup
import "../../styles/all.css";
import { useCart } from "../../context/CartContext";
import BarraNav from "./BarraNav";
import Footer from "./Footer";
import Swal from 'sweetalert2'; // Usamos Swal para feedback

export default function ProDetalle() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // 🔑 La URL trae el nombre completo del producto: ?producto=Torta%20Cuadrada%20de%20Chocolate
  const productoSeleccionadoRaw = queryParams.get("producto");

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const { addToCart } = useCart();
  
  // Asumimos un stock ficticio para el mockup
  const MOCK_STOCK = 10; 

  useEffect(() => {
    if (!productoSeleccionadoRaw) {
        setProducto(null);
        return;
    }

    // Decodifica la URL y elimina espacios extra
    const claveProducto = decodeURIComponent(productoSeleccionadoRaw).trim();
    
    // 🔑 CLAVE: BÚSQUEDA DIRECTA POR CLAVE EN EL OBJETO MOCKUP
    const foundProduct = productos[claveProducto]; 

    if (foundProduct) {
        // Agregamos la clave y el stock ficticio para usarlo en el carrito
        setProducto({
            ...foundProduct,
            keyName: claveProducto,
            stock: MOCK_STOCK
        });
    } else {
        setProducto(null);
    }
  }, [productoSeleccionadoRaw]);

  const agregarAlCarrito = () => {
    if (!producto || cantidad < 1 || cantidad > producto.stock) return;

    // Normalizamos los datos que enviamos al contexto
    const productoConCantidad = {
      nombre: producto.titulo, 
      precio: producto.precio,
      img: producto.imagen_principal,
      cantidad: Number(cantidad),
      key: producto.keyName
    };

    addToCart(productoConCantidad);
    
    Swal.fire({
      icon: 'success',
      title: '¡Añadido al Carrito!',
      text: `${productoConCantidad.nombre} x${productoConCantidad.cantidad} agregado.`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  };

  if (!producto) {
    return (
      <>
        <BarraNav/>
        <div style={{ padding: 50, textAlign: 'center' }}>
          <p>Producto "{productoSeleccionadoRaw}" no encontrado en el catálogo local.</p>
          <Link to="/productos">Volver al listado</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <BarraNav/>
        <div>
          <div className="breadcrumb">
            <Link to="/">Home</Link> &gt; <Link to="/productos">Productos</Link> &gt; <span>{producto.titulo}</span>
          </div>

          <main className="product-container">
            <div className="product-images">
              <img src={producto.imagen_principal} alt={producto.titulo} className="main-image" />
            </div>

            <div className="product-details">
              <h2 className="product-title">{producto.titulo}</h2>
              <p className="product-price">${(producto.precio).toLocaleString("es-CL")}</p>
              <p className="product-description">{producto.descripcion}</p>
              <p className="product-stock">Stock Disponible: {producto.stock}</p>

              <label htmlFor="cantidad">Cantidad</label>
              <input 
                type="number" 
                id="cantidad" 
                value={cantidad} 
                min="1" 
                max={producto.stock}
                onChange={(e) => setCantidad(Math.min(Number(e.target.value) || 1, producto.stock))} 
              />

              <button 
                className="btn-add" 
                onClick={agregarAlCarrito} 
                disabled={cantidad < 1 || producto.stock < 1} 
              >
                {producto.stock > 0 ? 'Añadir al carro' : 'Sin Stock'}
              </button>
            </div>
          </main>
        </div>
      <Footer />   
    </>   
  );
}