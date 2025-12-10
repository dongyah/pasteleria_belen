import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/all.css";
import "../../styles/Tienda.css"; 

function Footer() {
    const mapaUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.584980696752!2d-70.64771268480036!3d-33.43598588078028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c502b412953f%3A0x6c63b4b8a2e7c3e!2sPlaza%20de%20Armas!5e0!3m2!1ses-419!2scl!4v1675713726521!5m2!1ses-419!2scl";

    return (
        <footer className="footer-pro">
            <div className="footer-grid">
                
                <div className="footer-section footer-contact">
                    <h3 className="footer-title">Mil Sabores</h3>
                    <p>La Tradición más Dulce de Chile.</p>
                    <p><strong>Teléfono:</strong> <a href="tel:+56912345678">(+56) 9 1234 5678</a></p>
                    <p><strong>Email:</strong> <a href="mailto:contacto@milSabores.cl">contacto@milSabores.cl</a></p>
                    <p><strong>Horario:</strong> Lunes a Sábado, 9:00 - 20:00 hrs.</p>
                </div>

                <div className="footer-section footer-links">
                    <h3 className="footer-title">Enlaces Rápidos</h3>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/productos">Tienda</Link></li>
                        <li><Link to="/nosotros">Nuestra Historia</Link></li>
                        <li><Link to="/blog">Blog</Link></li>
                        <li><Link to="/contacto">Contacto</Link></li>
                    
                    </ul>
                </div>

                <div className="footer-section footer-payment">
                    <h3 className="footer-title">Medios de Pago</h3>
                    <div className="payment-icons">
                        <img src="/img/visa-icon.png" alt="Visa" title="Visa" />
                        <img src="/img/mastercard-icon.png" alt="Mastercard" title="Mastercard" />
                        <img src="/img/webpay-icon.png" alt="WebPay" title="WebPay Plus" />
                    </div>
                    <p className="security-text">Compra 100% segura y garantizada.</p>
                    <h3 className="footer-title">Síguenos</h3>
                    <div className="social-icons">
                        {/* Enlaces a redes sociales */}
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                             <img src="/img/instagram-icon.png" alt="Instagram" />
                        </a>
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                             <img src="/img/facebook-icon.png" alt="Facebook" />
                        </a>
                    </div>
                </div>

                <div className="footer-section footer-map">
                    <h3 className="footer-title">Nuestra Ubicación</h3>
                    <p>Av. Siempre Viva 742, Santiago, Chile</p>
                    <iframe
                        src={mapaUrl}
                        width="100%"
                        height="200"
                        style={{ border: 0, borderRadius: '8px' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación de Pastelería Mil Sabores"
                    ></iframe>
                </div>

            </div>

            <div className="footer-copyright">
                <p>© {new Date().getFullYear()} Pastelería Mil Sabores. Todos los derechos reservados. | Creado por Belén Toloza y Fernanda Riveros</p>
            </div>
        </footer>
    );
}

export default Footer;