import React from 'react';
import "../../styles/all.css";
import { Link } from 'react-router-dom';
import BarraNav from './BarraNav';
import Footer from './Footer';

// Datos de Blog estructurados
const articulos = [
    { id: 1, titulo: "Cake Painting: El Arte en el Postre", resumen: "¡Tendencia en pastelería! Esta técnica transforma los pasteles en obras de arte. Si buscas un toque moderno, ¡atrévete a probarla!", img: "img/pastel pintado.png", isFeatured: true }, // Destacado
    { id: 2, titulo: "La Paciencia del Artesano", resumen: "En un mundo de prisas, nosotros elegimos la paciencia. Cada uno de nuestros postres es el resultado de la dedicación y el cuidado de lo artesanal.", img: "img/mision.png", isFeatured: false },
    { id: 3, titulo: "Sabores que Despiertan Emociones", resumen: "Más que un simple dulce, cada bocado es una experiencia. Nuestros postres están creados para despertar tus sentidos y evocar momentos de felicidad.", img: "img/vision.png", isFeatured: false },
    { id: 4, titulo: "Tesoro de la Tierra: Milhojas de Merquén", resumen: "¡Atención a todos los golosos! Lanzamos la línea 'Tesoro de la Tierra', inspirada en sabores tradicionales, con la audaz combinación dulce y picante del merquén.", img: "img/torta de manjar.png", isFeatured: false },
    { id: 5, titulo: "Los Secretos de la Vainilla Pura", resumen: "Descubre por qué la vainilla natural es insustituible y cómo influye en el sabor final de nuestras tortas más vendidas. Calidad garantizada.", img: "img/torta de vainilla.png", isFeatured: false },
];

function Blog(){
    
    const articuloDestacado = articulos.find(a => a.isFeatured) || articulos[0];
    const listaArticulos = articulos.filter(a => !a.isFeatured);

    return(
    <>
      <BarraNav />
        <main className="blog-main-content">
            
            {/* === 1. BANNER PRINCIPAL / TÍTULO === */}
            <div className="blog-page-header">
                <h1 className="blog-page-title">Blog de Maestros Pasteleros</h1>
                <p className="blog-page-subtitle">Exclusividad, arte e innovación en la repostería fina.</p>
            </div>

            {/* === 2. ARTÍCULO DESTACADO (Diseño de Alto Impacto) === */}
            <section className="blog-featured">
                <div className="featured-image-box">
                    <img src={articuloDestacado.img} alt={articuloDestacado.titulo} className="featured-image" />
                </div>
                <div className="featured-text-box">
                    <span className="blog-tag">Tendencia</span>
                    <h2 className="featured-title">{articuloDestacado.titulo}</h2>
                    <p className="featured-summary">{articuloDestacado.resumen}</p>
                    <Link to={`/blog/${articuloDestacado.id}`} className="btn btn-featured">Leer Artículo Completo</Link>
                </div>
            </section>
            
            {/* --- Separador --- */}
            <hr className="divider-short" />

            {/* === 3. LISTADO DE ARTÍCULOS (Grid de Lista) === */}
            <section className="blog-list-section">
                <h2 className="section-title color-primary">Otros Temas de Interés</h2>
                
                <div className="blog-grid-list">
                    {listaArticulos.map(articulo => (
                        <Link to={`/blog/${articulo.id}`} key={articulo.id} className="list-card">
                            <img src={articulo.img} alt={articulo.titulo} className="list-card-img" />
                            <div className="list-card-content">
                                <h3 className="list-card-title">{articulo.titulo}</h3>
                                <p className="list-card-summary">{articulo.resumen}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

        </main>

      <Footer />
    </>
    )
}
export default Blog;