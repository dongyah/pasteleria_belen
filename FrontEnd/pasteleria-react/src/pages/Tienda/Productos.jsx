import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/all.css";
import "../../styles/Tienda.css";
import { useCart } from "../../context/CartContext";
import BarraNav from "./BarraNav";
import Footer from "./Footer";
import Swal from 'sweetalert2'; 
import { productos } from "../../data/productos"; 

function Productos() {
    const { addToCart } = useCart();
    const [filtro, setFiltro] = useState("all");

    const productosArray = Object.keys(productos).map(key => ({
        ...productos[key],
        tipo: key.toLowerCase().includes('cuadrada') ? 'cuadrada' 
            : key.toLowerCase().includes('circular') ? 'circular' 
            : key.toLowerCase().includes('individuales') || key.toLowerCase().includes('mousse') || key.toLowerCase().includes('tiramisú') ? 'individuales'
            : key.toLowerCase().includes('sin azúcar') ? 'sin-azúcar'
            : key.toLowerCase().includes('tradicional') || key.toLowerCase().includes('empanada') || key.toLowerCase().includes('tarta de santiago') ? 'tradicional'
            : key.toLowerCase().includes('sin gluten') ? 'sin-gluten'
            : key.toLowerCase().includes('vegan') ? 'veganos'
            : key.toLowerCase().includes('especial') ? 'especiales'
            : 'all', 
        keyName: key 
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

    const handleAddToCartClick = (prod) => {
        
        const productForCart = {
            nombre: prod.titulo || prod.nombre, 
            precio: prod.precio,
            img: prod.imagen_principal || prod.img,
            cantidad: 1,
            key: prod.keyName
        };

        addToCart(productForCart);

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

    return (
        <>
            <BarraNav />
            <main className="product-page-main">
                
                <div className="product-page-header">
                    <h1 className="product-page-title">Nuestro Catálogo</h1>
                    <p className="product-page-subtitle">Descubre la exclusividad de nuestra repostería por categoría.</p>
                </div>

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