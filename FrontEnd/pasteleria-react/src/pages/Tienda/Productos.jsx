import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/all.css";
import "../../styles/Tienda.css";
import { useCart } from "../../context/CartContext";
import BarraNav from "./BarraNav";
import Footer from "./Footer";

function Productos() {
    const { addToCart } = useCart();
    const [filtro, setFiltro] = useState("all");

    // Datos simulados (se mantienen)
    const productos = [
        { tipo: "cuadrada", nombre: "Torta Cuadrada de Chocolate", precio: 45000, img: "/img/Torta de chocolate.png" },
        { tipo: "cuadrada", nombre: "Torta Cuadrada de Frutas", precio: 50000, img: "/img/torta de frutas.png" },
        { tipo: "circular", nombre: "Torta Circular de Vainilla", precio: 40000, img: "/img/torta de vainilla.png" },
        { tipo: "circular", nombre: "Torta Circular de Manjar", precio: 42000, img: "/img/torta de manjar.png" },
        { tipo: "individuales", nombre: "Mousse de Chocolate", precio: 5000, img: "/img/mousse de chocolate.png" },
        { tipo: "individuales", nombre: "Tiramisú Clásico", precio: 5500, img: "/img/Tiramisú Clásico.png" },
        { tipo: "sin-azúcar", nombre: "Torta Sin Azúcar de Naranja", precio: 48000, img: "/img/Torta Sin Azúcar de Naranja.png" },
        { tipo: "sin-azúcar", nombre: "Cheesecake Sin Azúcar", precio: 47000, img: "/img/Cheesecake Sin Azúcar.png" },
        { tipo: "tradicional", nombre: "Empanada de Manzana", precio: 3000, img: "/img/Empanada de Manzana.png" },
        { tipo: "tradicional", nombre: "Tarta de Santiago", precio: 6000, img: "/img/Tarta de Santiago.png" },
        { tipo: "sin-gluten", nombre: "Brownie Sin Gluten", precio: 4000, img: "/img/Brownie Sin Gluten.png" },
        { tipo: "sin-gluten", nombre: "Pan Sin Gluten", precio: 3500, img: "/img/Pan Sin Gluten.png" },
        { tipo: "veganos", nombre: "Torta Vegana de Chocolate", precio: 50000, img: "/img/Torta Vegana de Chocolate.png" },
        { tipo: "veganos", nombre: "Galletas Veganas de Avena", precio: 4500, img: "/img/Galletas Veganas de Avena.png" },
        { tipo: "especiales", nombre: "Torta Especial de Cumpleaños", precio: 55000, img: "/img/Torta Especial de cumpleaños.png" },
        { tipo: "especiales", nombre: "Torta Especial de Boda", precio: 60000, img: "/img/Torta Especial de Boda.png" },
    ];

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
        filtro === "all" ? productos : productos.filter((p) => p.tipo === filtro);

    return (
        <>
            <BarraNav />
            <main className="product-page-main"> {/* CLASE PRINCIPAL */}
                
                <div className="product-page-header">
                    <h1 className="product-page-title">Nuestro Catálogo</h1>
                    <p className="product-page-subtitle">Descubre la exclusividad de nuestra repostería por categoría.</p>
                </div>

                {/* --- NAVEGACIÓN DE CATEGORÍAS (Barra Scrollable) --- */}
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
                        // Usamos Link para el detalle y la clase gallery-card
                        <div className="gallery-card" key={index}> 
                            <Link to={`/producto-detalle?producto=${encodeURIComponent(prod.nombre)}`}>
                                <img src={prod.img} alt={prod.nombre} className="gallery-card-img" />
                                <div className="gallery-card-info">
                                    <h3 className="gallery-card-title">{prod.nombre}</h3>
                                </div>
                            </Link>
                            <div className="card-footer-action">
                                <p className="gallery-card-price">${prod.precio.toLocaleString()} CLP</p>
                                <button className="btn btn-card-action" onClick={() => addToCart(prod)}>
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