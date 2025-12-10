import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../../styles/all.css";
import "../../styles/Tienda.css";
import { useCart } from "../../context/CartContext";
import BarraNav from "./BarraNav";
import Footer from "./Footer";

function Carrito() {
    const {
        cart,
        total,
        clearCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
    } = useCart();

    const navigate = useNavigate(); // Hook de navegación

    const handleCheckout = () => {
        if (cart.length > 0) {
            navigate("/checkout"); // Redirige al nuevo componente de Checkout
        } else {
            window.Swal.fire('Carrito Vacío', 'Añade productos antes de continuar.', 'warning');
        }
    };

    return (
        <>
            <BarraNav />
            <main className="cart-page-main">
                <div className="cart-container">
                    <h1 className="cart-title">🛒 Carrito de Compras</h1>

                    {cart.length === 0 ? (
                        <div className="empty-cart-message">
                            <span className="icon-large">🛍️</span>
                            <p>Tu carrito está vacío. ¡Es momento de endulzar tu día!</p>
                            <Link to="/productos" className="btn btn-large">Ver Productos</Link>
                        </div>
                    ) : (
                        <div className="cart-grid">
                            <div className="cart-list-column">
                                {cart.map((item, index) => (
                                    <div key={index} className="carrito-item-pro">
                                        <img src={item.img} alt={item.nombre} className="item-img-pro" />
                                        <div className="item-details-pro">
                                            <h4>{item.nombre}</h4>
                                            <p className="item-price-pro">${item.precio.toLocaleString()} CLP</p>
                                            
                                            <div className="controles">
                                                <button onClick={() => decreaseQuantity(item.nombre)} className="btn-qty">
                                                    ➖
                                                </button>
                                                <span className="qty-value">{item.cantidad}</span>
                                                <button onClick={() => increaseQuantity(item.nombre)} className="btn-qty">
                                                    ➕
                                                </button>
                                            </div>
                                        </div>

                                        <div className="item-subtotal-pro">
                                            <p className="subtotal-label">Subtotal</p>
                                            <p className="subtotal-value">${(item.precio * item.cantidad).toLocaleString()} CLP</p>
                                            <button
                                                className="btn-remove"
                                                onClick={() => removeFromCart(item.nombre)}
                                            >
                                                ❌ Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary-column">
                                <h3 className="summary-title">Resumen de la Compra</h3>
                                <div className="summary-total">
                                    <span>Total a Pagar:</span>
                                    <span className="total-amount">${total.toLocaleString()} CLP</span>
                                </div>
                                <button onClick={handleCheckout} className="btn btn-large btn-checkout">
                                    Proceder al Pago
                                </button>
                                <button onClick={clearCart} className="btn btn-secondary-empty">
                                    Vaciar Carrito
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Carrito;