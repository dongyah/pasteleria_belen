import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/all.css";
import "../../styles/Tienda.css";
import { useCart } from "../../context/CartContext";
import BarraNav from "./BarraNav";
import Footer from "./Footer";
// 🔑 Importamos SweetAlert2 para mostrar el feedback rápido
import Swal from 'sweetalert2'; 

// 🔑 IMPORTAR EL MOCKUP DEL ARCHIVO LOCAL (asumo que se llama productos)
import { productos } from "../../data/productos"; 

function Productos() {
    const { addToCart } = useCart();
    const [filtro, setFiltro] = useState("all");

    // 🔑 TRANSFORMAR EL OBJETO MOCKUP A UN ARRAY USABLE
    const productosArray = Object.keys(productos).map(key => ({
        ...productos[key],
        // Lógica de filtrado temporal para el mockup
        tipo: key.toLowerCase().includes('cuadrada') ? 'cuadrada' 
            : key.toLowerCase().includes('circular') ? 'circular' 
            : key.toLowerCase().includes('individuales') || key.toLowerCase().includes('mousse') || key.toLowerCase().includes('tiramisú') ? 'individuales'
            : key.toLowerCase().includes('sin azúcar') ? 'sin-azúcar'
            : key.toLowerCase().includes('tradicional') || key.toLowerCase().includes('empanada') || key.toLowerCase().includes('tarta de santiago') ? 'tradicional'
            : key.toLowerCase().includes('sin gluten') ? 'sin-gluten'
            : key.toLowerCase().includes('vegan') ? 'veganos'
            : key.toLowerCase().includes('especial') ? 'especiales'
            : 'all', 
        keyName: key // Guardamos la clave para el URL
    }));

    const categorias = [
        { key: "all", label: "Todos" },
        { key: "cuadrada", label: "Tortas Cuadradas" },
        { key: "circular", label: "Tortas Circulares" },
        { key: "individuales", label: "Postres Individuales" },
        { key: "sin-azúcar", label: "Productos Sin Azúcar" },
        { key: "tradicional", label: "Pastelería Tradicional" },
        { key: "sin-gluten", label: "Productos sin Gluten" },
        { key: "veganos", label: "Productos Veganos" },
        { key: "especiales", label: "Tortas Especiales" },
    ];

    const productosFiltrados =
        filtro === "all" ? productosArray : productosArray.filter((p) => p.tipo === filtro);

    // --- FUNCIÓN PARA AÑADIR AL CARRO (1 UNIDAD CON ALERTA TOAST) ---
    const handleAddToCartClick = (prod) => {
        
        // 1. Crear el objeto para el carrito (siempre con 1 unidad)
        const productForCart = {
            nombre: prod.titulo || prod.nombre, 
            precio: prod.precio,
            img: prod.imagen_principal || prod.img,
            cantidad: 1, // ⬅️ Siempre agregamos 1 unidad
            key: prod.keyName
        };

        // 2. Agregar al carrito
        addToCart(productForCart);

        // 3. Feedback: Mostrar Alerta Toast
        Swal.fire({
            icon: 'success',
            title: '¡Añadido a la Bolsa!',
            text: `${productForCart.nombre} agregado (1 unidad).`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    };
    // ----------------------------------------------------------------

    return (
        <>
            <BarraNav />
            <main className="product-page-main">
                
                <div className="product-page-header">
                    <h1 className="product-page-title">Nuestro Catálogo</h1>
                    <p className="product-page-subtitle">Descubre la exclusividad de nuestra repostería por categoría.</p>
                </div>

                {/* --- NAVEGACIÓN DE CATEGORÍAS --- */}
                <div className="category-nav-container">
                    <div className="category-nav">
                        {categorias.map(cat => (
                            <button 
                                key={cat.key}
                                className={`category-btn ${filtro === cat.key ? 'active' : ''}`}
                                onClick={() => setFiltro(cat.key)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- GALERÍA DE PRODUCTOS --- */}
                <section className="product-gallery">
                    {productosFiltrados.map((prod, index) => (
                        <div className="gallery-card" key={prod.keyName || index}> 
                            
                            <Link to={`/producto-detalle?producto=${encodeURIComponent(prod.titulo || prod.nombre)}`}>
                                <img src={prod.imagen_principal || prod.img} alt={prod.titulo || prod.nombre} className="gallery-card-img" />
                                <div className="gallery-card-info">
                                    <h3 className="gallery-card-title">{prod.titulo || prod.nombre}</h3>
                                </div>
                            </Link>
                            
                            <div className="card-footer-action">
                                <p className="gallery-card-price">${(prod.precio || 0).toLocaleString()} CLP</p>
                                
                                {/* 🔑 CLAVE: Usamos la función simple para añadir 1 unidad y mostrar el Toast */}
                                <button 
                                    className="btn btn-card-action" 
                                    onClick={() => handleAddToCartClick(prod)}
                                >
                                    Añadir al Carrito
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {productosFiltrados.length === 0 && (
                        <p className="text-center w-100">No hay productos en esta categoría.</p>
                    )}
                </section>
                
            </main>
            <Footer />
        </>
    );
}

export default Productos;