import React from "react";
import { Link } from "react-router-dom";
import "../../styles/all.css"; 
import "../../styles/Tienda.css"; 
import BarraNav from "./BarraNav";
import Footer from "./Footer";

function Home() {
    // Datos simulados de productos destacados.
    // El campo 'nombre' debe coincidir con la clave del objeto en tu mockup de productos.
    const productosDestacados = [
        { nombre: "Torta Cuadrada de Chocolate", precio: 45000, img: "/img/Torta de chocolate.png" },
        { nombre: "Tiramisú Clásico", precio: 5500, img: "/img/Tiramisú Clásico.png" },
        { nombre: "Cheesecake Sin Azúcar", precio: 47000, img: "/img/Cheesecake Sin Azúcar.png" },
        { nombre: "Torta Especial de Cumpleaños", precio: 55000, img: "/img/Torta Especial de cumpleaños.png" },
        { nombre: "Torta Vegana de Chocolate", precio: 50000, img: "/img/Torta Vegana de Chocolate.png" },
        { nombre: "Tarta de Santiago", precio: 6000, img: "/img/Tarta de Santiago.png" },
    ];
    
    return (
        <>
            <BarraNav />
            <main className="home-content">
                
                <section className="hero-section">
                    <img 
                        src="img/tienda online.png" 
                        alt="Pastelería Fina de Lujo" 
                        className="hero-image"
                    />
                    <div className="hero-box">
                        <h1 className="hero-title">Pastelería Mil Sabores</h1>
                        <p className="hero-subtitle">La Tradición de Chile</p>
                        <p className="hero-text">
                            Más de 50 años de experiencia, coronados por nuestra participación en el récord Guinness de 1995. Descubra la excelencia en repostería.
                        </p>
                        <Link to="/productos" className="btn btn-large">Explorar Catálogo</Link>
                    </div>
                </section>

                
                <section className="featured-products">
                    <h2 className="section-title">Nuestros productos destacados</h2>
                    <p className="section-description">Una dulce selección de los favoritos de nuestros clientes más exigentes.</p>
                    
                    <div className="product-grid">
                        {productosDestacados.map((prod, index) => (
                            <Link 
                                to={`/producto-detalle?producto=${encodeURIComponent(prod.nombre)}`} 
                                key={index} 
                                className="product-card"
                            >
                                <img src={prod.img} alt={prod.nombre} className="product-card-img" /> 
                                <div className="card-body-home">
                                    <h3 className="card-title-home">{prod.nombre}</h3>
                                    <p className="precio">${prod.precio.toLocaleString()} CLP</p>
                                    <span className="btn btn-small">Ver Detalle</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="blog-section">
                    <h2 className="section-title color-primary">Novedades y Tendencias</h2>
                    <p className="section-description">Descubre las últimas tendencias y consejos de nuestros Maestros Pasteleros.</p>

                    <div className="blog-grid">
                        
                        <div className="blog-card">
                            <img src="img/pastel pintado.png" alt="Cake Painting" className="blog-card-img" />
                            <h3 className="blog-card-title">Cake Painting: El Arte en el Postre</h3>
                            <p className="blog-card-summary">Esta técnica innovadora transforma los pasteles en lienzos comestibles, elevando la pastelería a un nivel de exclusividad y sofisticación nunca antes visto.</p>
                            <Link to="/blog" className="btn btn-blog">Ver Artículo</Link>
                        </div>

                        <div className="blog-card">
                            <img src="img/torta de manjar.png" alt="Tortas Veganas" className="blog-card-img" /> 
                            <h3 className="blog-card-title">Pastelería Con Conciencia: El Auge Vegano</h3>
                            <p className="blog-card-summary">Analizamos la creciente demanda de productos veganos y cómo hemos adaptado nuestros clásicos (manjar, chocolate) a versiones 100% vegetales.</p>
                            <Link to="/blog" className="btn btn-blog">Ver Artículo</Link>
                        </div>

                        <div className="blog-card hide-on-mobile">
                            <img src="img/tienda online.png" alt="Récord Guinness" className="blog-card-img" /> 
                            <h3 className="blog-card-title">Nuestra Historia: El Récord de 1995</h3>
                            <p className="blog-card-summary">Conozca la historia detrás de nuestra participación en la creación de la torta más grande del mundo y cómo forjó nuestra tradición.</p>
                            <Link to="/blog" className="btn btn-blog">Ver Historia</Link>
                        </div>
                        
                    </div>
                    
                    <div className="blog-footer">
                        <Link to="/blog" className="btn btn-primary btn-large">Ver Todas las Noticias del Blog</Link>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}

export default Home;