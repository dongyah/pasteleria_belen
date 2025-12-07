import React, { useState } from "react";
import "../../styles/all.css";
import BarraNav from "./BarraNav";
import Footer from "./Footer";
import Swal from 'sweetalert2'; // Asumimos que Swal está cargado

function Contacto() {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        asunto: '', // Agregamos un campo Asunto
        mensaje: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Simulación de validación
        if (!formData.nombre || !formData.correo || !formData.mensaje) {
            Swal.fire('Error', 'Por favor, completa los campos obligatorios.', 'error');
            return;
        }

        // Aquí iría la llamada a la API de envío de correo (ej: axios.post('/api/contacto', formData))

        Swal.fire({
            title: 'Mensaje Enviado',
            text: 'Gracias por contactarnos. Responderemos a tu solicitud lo antes posible.',
            icon: 'success'
        });

        // Limpiar el formulario
        setFormData({ nombre: '', correo: '', asunto: '', mensaje: '' });
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
                    
                    {/* 1. INFORMACIÓN DE CONTACTO DIRECTA */}
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
                                type="text" id="nombre" name="nombre" 
                                placeholder="Nombre completo *" value={formData.nombre} 
                                onChange={handleChange} required 
                            />
                            
                            <input 
                                type="email" id="correo" name="correo" 
                                placeholder="Correo electrónico *" value={formData.correo} 
                                onChange={handleChange} required 
                            />
                            
                            <input 
                                type="text" id="asunto" name="asunto" 
                                placeholder="Asunto (Pedido, Consulta, Feedback)" value={formData.asunto} 
                                onChange={handleChange} 
                            />
                            
                            <textarea 
                                id="mensaje" name="mensaje" 
                                placeholder="Escribe tu mensaje o detalle tu pedido especial aquí..." 
                                value={formData.mensaje}
                                onChange={handleChange} required
                            ></textarea>

                            <button type="submit" className="btn btn-contacto-submit">Enviar Mensaje</button>
                        </form>
                    </div>

                </div>
            </main>
            <Footer />
        </>
    )
}

export default Contacto;