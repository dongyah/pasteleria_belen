// Importaciones generales
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; 

// Componentes de la tienda (parte pública)
import Blog from "./pages/Tienda/Blog";
import Productos from "./pages/Tienda/Productos";
import Nosotros from "./pages/Tienda/Nosotros";
import Home from "./pages/Tienda/Home";
import Carrito from "./pages/Tienda/Carrito";
import Registro from "./pages/Tienda/Registro";
import Login from "./pages/Tienda/Login";
import Contacto from "./pages/Tienda/Contacto";
import ProDetalle from "./pages/Tienda/ProDetalle";
import Checkout from "./pages/Tienda/Checkout";
import Confirmacion from "./pages/Tienda/Confirmacion";

// Componentes del panel administrativo
import Admin_Dashboard from "./pages/admin/Admin_Dashboard";
import Admin_NuevoUsuario from "./pages/admin/Usuarios/Admin_NuevoUsuario";
import Admin_NuevoProducto from "./pages/admin/Productos/Admin_NuevoProducto";
import Admin_EditarUsuario from "./pages/admin/Usuarios/Admin_EditarUsuario";
import Admin_EditarProducto from "./pages/admin/Productos/Admin_EditarProducto";
import Admin_GestionUsuarios from "./pages/admin/Usuarios/Admin_GestionUsuarios";
import Admin_GestionProductos from "./pages/admin/Productos/Admin_GestionProductos";
import Admin_GestionOrdenes from "./pages/admin/Ordenes/Admin_GestionOrdenes";
import Admin_MostrarBoleta from "./pages/admin/Ordenes/Admin_MostrarBoleta";
import Admin_Reportes from "./pages/admin/Reportes/Admin_Reportes";
import Admin_Perfil from "./pages/admin/Perfil/Admin_Perfil";
import Admin_HistorialCompras from "./pages/admin/Usuarios/Admin_HistorialCompras";
import Admin_NuevaCategoria from "./pages/admin/Categorías/Admin_NuevaCategoria";
import Admin_GestionCategorias from "./pages/admin/Categorías/Admin_GestionCategoria";
import Admin_EditarCategoria from "./pages/admin/Categorías/Admin_EditarCategoria";


// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/Admin.css";
import "./styles/Admin_NuevoUsuario.css";
import "./styles/Admin_NuevoProducto.css";
import "./styles/Admin_Gestion.css";
import "./styles/all.css"; 
import "./styles/Tienda.css";


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>

		  {/* ---------- RUTAS PÚBLICAS (tienda) ---------- */}
		  <Route path='/' element={<Home />} />
		  {/* Ruta alternativa para la tienda (permite navegacion desde /tienda) */}
		  <Route path='/tienda' element={<Home />} />
            <Route path='/nosotros' element={<Nosotros />} />
          	<Route path='/blog' element={<Blog />} />
          	<Route path='/productos' element={<Productos />} />
          	<Route path='/carrito' element={<Carrito />} />
      	    <Route path='/registro' element={<Registro />} />
          	<Route path='/login' element={<Login />} />
          	<Route path='/contacto' element={<Contacto />} />
          	<Route path='/producto-detalle' element={<ProDetalle />} />

          	<Route path='/checkout' element={<Checkout />} />
          	<Route path='/confirmacion/:orderId' element={<Confirmacion />} />

          	{/* ---------- RUTAS ADMINISTRATIVAS ---------- */}
          	<Route path='/admin' element={<Admin_Dashboard />} />
          	<Route path='/admin/usuarios' element={<Admin_GestionUsuarios />} />
        	  <Route path='/admin/nuevo-usuario' element={<Admin_NuevoUsuario />} />
          	<Route path='/admin/editar-usuario/:id' element={<Admin_EditarUsuario />} />
          	<Route path='/admin/usuarios/historial/:id' element={<Admin_HistorialCompras />} />

          	<Route path='/admin/productos' element={<Admin_GestionProductos />} />
          	<Route path='/admin/nuevo-producto' element={<Admin_NuevoProducto />} />
      	    <Route path='/admin/editar-producto/:id' element={<Admin_EditarProducto />} />

  	        <Route path='/admin/ordenes' element={<Admin_GestionOrdenes />} />
          	<Route path='/admin/ordenes/:id' element={<Admin_MostrarBoleta />} />

          	<Route path='/admin/reportes' element={<Admin_Reportes />} />
          	<Route path='/admin/perfil' element={<Admin_Perfil />} />

          	<Route path='/admin/nueva-categoria' element={<Admin_NuevaCategoria />} />
          	<Route path='/admin/categorias' element={<Admin_GestionCategorias />} />
          	<Route path='/admin/editar-categoria/:id' element={<Admin_EditarCategoria />} />

          </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;