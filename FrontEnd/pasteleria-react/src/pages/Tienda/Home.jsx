import { Link } from "react-router-dom";
import "../../styles/all.css"; 
import BarraNav from "./BarraNav";
import Footer from "./Footer";

function Home() {
    // Datos simulados de productos destacados, elegidos del catálogo completo
    const productosDestacados = [
        // 1. Torta Cuadrada
        { nombre: "Torta Cuadrada de Chocolate", precio: 45000, img: "/img/Torta de chocolate.png", id: 1 },
        // 2. Postre Individual
        { nombre: "Tiramisú Clásico", precio: 5500, img: "/img/Tiramisú Clásico.png", id: 6 },
        // 3. Opción Sin Azúcar
        { nombre: "Cheesecake Sin Azúcar", precio: 47000, img: "/img/Cheesecake Sin Azúcar.png", id: 8 },
        // 4. Torta Especial
        { nombre: "Torta Especial de Cumpleaños", precio: 55000, img: "/img/Torta Especial de cumpleaños.png", id: 15 },
        // 5. Opción Vegana
        { nombre: "Torta Vegana de Chocolate", precio: 50000, img: "/img/Torta Vegana de Chocolate.png", id: 13 },
        // 6. Producto Tradicional
        { nombre: "Tarta de Santiago", precio: 6000, img: "/img/Tarta de Santiago.png", id: 10 },
    ];
    
    // NOTA: Los IDs son temporales y deben coincidir con la URL de destino de tus rutas
    // (ej: Link to={`/productos/${prod.id}`})

    return (
        <>
            <BarraNav />
            <main className="home-content">
                
                {/* === 1. HERO SECTION (Alto Impacto) === */}
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

                
                {/* === 2. PRODUCTOS DESTACADOS === */}
                <section className="featured-products">
                    <h2 className="section-title">Nuestros productos destacados</h2>
                    <p className="section-description">Una dulce selección de los favoritos de nuestros clientes más exigentes.</p>
                    
                    <div className="product-grid">
                        {productosDestacados.map((prod, index) => (
                            <Link to={`/productos/${prod.id}`} key={index} className="product-card">
                                {/* Aseguramos que la ruta de la imagen inicie correctamente */}
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

                {/* === 3. SECCIÓN DE BLOG/INFO RÁPIDA (Blog Grid) === */}
                <section className="blog-section">
                    <h2 className="section-title color-primary">Novedades y Tendencias</h2>
                    <p className="section-description">Descubre las últimas tendencias y consejos de nuestros Maestros Pasteleros.</p>

                    <div className="blog-grid">
                        
                        {/* Artículo 1: Cake Painting */}
                        <div className="blog-card">
                            <img src="img/pastel pintado.png" alt="Cake Painting" className="blog-card-img" />
                            <h3 className="blog-card-title">Cake Painting: El Arte en el Postre</h3>
                            <p className="blog-card-summary">Esta técnica innovadora transforma los pasteles en lienzos comestibles, elevando la pastelería a un nivel de exclusividad y sofisticación nunca antes visto.</p>
                            <Link to="/blog" className="btn btn-blog">Ver Artículo</Link>
                        </div>

                        {/* Artículo 2: Nueva Tendencia (Ejemplo) */}
                        <div className="blog-card">
                            <img src="img/torta de manjar.png" alt="Tortas Veganas" className="blog-card-img" /> 
                            <h3 className="blog-card-title">Pastelería Con Conciencia: El Auge Vegano</h3>
                            <p className="blog-card-summary">Analizamos la creciente demanda de productos veganos y cómo hemos adaptado nuestros clásicos (manjar, chocolate) a versiones 100% vegetales.</p>
                            <Link to="/blog" className="btn btn-blog">Ver Artículo</Link>
                        </div>

                        {/* Artículo 3: Récord Guinness (Ejemplo) */}
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