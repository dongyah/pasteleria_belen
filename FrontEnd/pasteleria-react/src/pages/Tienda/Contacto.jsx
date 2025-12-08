import React, { useState } from "react";
import "../../styles/all.css";
import BarraNav from "./BarraNav";
import Footer from "./Footer";
import Swal from 'sweetalert2'; 
import axios from 'axios'; // Importar Axios

// URL base de tu backend (Ajustar si es necesario)
const API_BASE_URL = 'http://localhost:8015/api/v1'; 

function Contacto() {
    const [formData, setFormData] = useState({
        nombreContacto: '',
        correoContacto: '',
        asuntoContacto: '', 
        mensajeContacto: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => { // Función ahora es async
        e.preventDefault();
        
        // 1. Validación básica
        if (!formData.nombreContacto || !formData.correoContacto || !formData.mensajeContacto) {
            Swal.fire('Error', 'Por favor, completa los campos obligatorios.', 'error');
            return;
        }

        setIsSubmitting(true); // Bloquear el botón
        
        try {
            // 2. Llamada a la API (Asumo /api/v1/contacto o /api/contacto)
            // Usaremos /contacto para seguir la convención de tu comentario
            const response = await axios.post(`${API_BASE_URL}/contacto/save`, formData); 
            
            // 3. Respuesta exitosa
            Swal.fire({
                title: 'Mensaje Enviado',
                text: 'Gracias por contactarnos. Responderemos a tu solicitud lo antes posible.',
                icon: 'success'
            });

            // Limpiar el formulario
            setFormData({ nombreContacto: '', correoContacto: '', asuntoContacto: '', mensajeContacto: '' });

        } catch (error) {
            // 4. Manejo de errores de la API
            console.error("Error al enviar el formulario:", error.response || error);
            
            let errorMsg = 'No se pudo enviar el mensaje. Inténtelo más tarde o revise la conexión.';
            if (error.response && error.response.status === 400) {
                 errorMsg = 'Error en los datos enviados. Verifique su correo.';
            }

            Swal.fire({
                title: 'Error de Envío',
                text: errorMsg,
                icon: 'error'
            });

        } finally {
            setIsSubmitting(false); // Desbloquear el botón
        }
    };

    // URL de ejemplo para Google Maps (similar al footer)
    const mapaUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.584980696752!2d-70.64771268480036!3d-33.43598588078028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c502b412953f%3A0x6c63b4b8a2e7c3e!2sPlaza%20de%20Armas!5e0!3m2!1ses-419!2scl!4v1675713726521!5m2!1ses-419!2scl";

    return (
        <>
            <BarraNav />
            <main className="contacto-page-main">
                
                <h1 className="contacto-title">Contáctanos</h1>
                <p className="contacto-subtitle">Estamos listos para ayudarte con tu próximo pedido especial.</p>

                <div className="contacto-grid">
                    
                    {/* 1. INFORMACIÓN DE CONTACTO DIRECTA (Se mantiene igual) */}
                    <div className="contacto-info-box">
                        <h2 className="info-title">Información Directa</h2>
                        <p className="info-detail">
                            <span className="info-label">📍 Dirección Principal:</span> <br/>
                            Av. Siempre Viva 742, Santiago, Chile
                        </p>
                        <p className="info-detail">
                            <span className="info-label">📞 Teléfono:</span> <br/>
                            <a href="tel:+56912345678">(+56) 9 1234 5678</a>
                        </p>
                        <p className="info-detail">
                            <span className="info-label">📧 Email:</span> <br/>
                            <a href="mailto:pedidos@milSabores.cl">pedidos@milSabores.cl</a>
                        </p>
                        <p className="info-detail">
                            <span className="info-label">⏰ Horario:</span> <br/>
                            Lunes a Sábado, 9:00 - 20:00 hrs.
                        </p>

                        <div className="mapa-pequeno">
                            <h3 className="info-title-sm">Visítanos</h3>
                            <iframe
                                src={mapaUrl}
                                width="100%"
                                height="200"
                                style={{ border: 0, borderRadius: '8px' }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Ubicación de Pastelería Mil Sabores"
                            ></iframe>
                        </div>
                    </div>

                    {/* 2. FORMULARIO DE CONTACTO */}
                    <div className="contacto-form-box">
                        <h2 className="info-title">Envíanos un Mensaje</h2>
                        <form id="form-contacto" onSubmit={handleSubmit}>
                            
                            <input 
                                type="text" id="nombreContacto" name="nombreContacto" 
                                placeholder="Nombre completo *" value={formData.nombreContacto} 
                                onChange={handleChange} required 
                            />
                            
                            <input 
                                type="email" id="correoContacto" name="correoContacto" 
                                placeholder="Correo electrónico *" value={formData.correoContacto} 
                                onChange={handleChange} required 
                            />
                            
                            <input 
                                type="text" id="asuntoContacto" name="asuntoContacto" 
                                placeholder="Asunto (Pedido, Consulta, Feedback)" value={formData.asuntoContacto} 
                                onChange={handleChange} 
                            />
                            
                            <textarea 
                                id="mensajeContacto" name="mensajeContacto" 
                                placeholder="Escribe tu mensaje o detalle tu pedido especial aquí..." 
                                value={formData.mensajeContacto}
                                onChange={handleChange} required
                            ></textarea>

                            <button type="submit" className="btn btn-contacto-submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                            </button>
                        </form>
                    </div>

                </div>
            </main>
            <Footer />
        </>
    )
}

export default Contacto;