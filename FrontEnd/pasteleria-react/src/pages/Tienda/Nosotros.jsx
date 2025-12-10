import "../../styles/all.css";
import BarraNav from "./BarraNav";
import Footer from "./Footer";
import { Link } from 'react-router-dom'; 

function Nosotros() {
    return(
        <>
            <BarraNav />
            <main className="nosotros-main">
                
                <div className="nosotros-header">
                    <h1 className="nosotros-title">Nuestra Tradición y Misión</h1>
                </div>

                
                <section className="history-section split-content reverse-order">
                    <div className="split-text-box">
                        <h2 className="section-subtitle color-primary">Nuestra Misión</h2>
                        <p className="history-text">
                            Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos de repostería de alta calidad para todas las ocasiones. Celebramos nuestras raíces históricas y fomentamos la creatividad y la innovación en cada uno de nuestros procesos.
                        </p>
                        <p className="history-text">
                            La calidad de nuestros ingredientes y el arte de nuestros maestros pasteleros es lo que nos distingue.
                        </p>
                    </div>
                    <div className="split-image-box">
                        <img src="img/mision.png" alt="Chef con un pastel" className="history-image" />
                    </div>
                </section>
                
                <section className="history-section split-content">
                    <div className="split-text-box">
                        <h2 className="section-subtitle color-primary">Nuestra Visión</h2>
                        <p className="history-text">
                            Convertirnos en la tienda online líder de productos de repostería en Chile, siendo reconocidos por nuestra constante innovación, la calidad inigualable de nuestros productos y el impacto positivo que generamos en la comunidad, especialmente en la formación y apoyo de nuevos talentos en gastronomía.
                        </p>
                        <p className="history-text">
                            Buscamos que Pastelería Mil Sabores sea sinónimo de excelencia y vanguardia dulce a nivel nacional.
                        </p>
                    </div>
                    <div className="split-image-box">
                        <img src="img/vision.png" alt="Múltiples chefs haciendo pasteles" className="history-image" />
                    </div>
                </section>


                <section className="guinness-section">
                    <div className="guinness-box">
                        <h2 className="section-title color-primary">La Historia que nos Distingue</h2>
                        <h3 className="guinness-subtitle">PARTICIPACIÓN EN EL RÉCORD GUINNESS DE 1995</h3>
                        <p className="guinness-text">
                            Fuimos parte del equipo de pasteleros que creó la torta más grande del mundo, un hito que define nuestro compromiso con la excelencia y la magnitud del arte en la repostería. Este legado es la base de nuestra tradición.
                        </p>
                        <Link to="/blog" className="btn btn-large btn-history">Ver Más Historias</Link>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    )
}
export default Nosotros;