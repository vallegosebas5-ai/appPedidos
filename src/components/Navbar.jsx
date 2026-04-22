import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';
  const cartCount = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const isProductor = user?.role === 'productor';

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to={isProductor ? "/producer/dashboard" : "/"} className="navbar__logo">
          <span className="navbar__logo-icon">🛒</span> App Pedidos
        </Link>

        <div className="navbar__menu">
          {!isProductor && (
            <>
              <Link to="/" className="navbar__link">Inicio</Link>
              <Link to="/cart" className="navbar__link">
                🛒 Carrito {cartCount > 0 && <span className="cart-badge">({cartCount})</span>}
              </Link>
            </>
          )}

          {isProductor && (
            <Link to="/producer/dashboard" className="navbar__link">
              📊 Mi Panel (Productor)
            </Link>
          )}

          {user ? (
            <>
              <Link to="/profile" className="navbar__link">Mi Perfil</Link>
              <button className="navbar__logout" onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <Link to="/login" className="navbar__button">Ingresar</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;