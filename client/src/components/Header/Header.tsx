import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../assets/logo.svg';
import './Header.css';

/**
 * Componente de encabezado de la aplicación
 * 
 * Responsabilidades:
 * 1. Mostrar el logo
 * 2. Mostrar navegación según estado de autenticación
 * 3. Mostrar email del usuario autenticado
 * 4. Gestionar el cierre de sesión
 * 
 * Renderizado condicional:
 * - Usuario autenticado: Recetas | Favoritos | email | Cerrar sesión
 * - Usuario no autenticado: Iniciar sesión | Registrarse
 */
function Header() {
  const { logout, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  /**
   * Cerrar sesión del usuario
   * 
   * Pasos:
   * 1. Llamar logout() para limpiar estado y localStorage
   * 2. Redirigir a /login
   */
  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="header">
      <div className="header__inner">
        {/* Logo */}
        <img 
          src={Logo} 
          alt="Logo de Buscador de recetas" 
          className="header__logo" 
        />

        {/* Navegación condicional según autenticación */}
        <nav className="header__nav">
          {/* Si el usuario está autenticado, mostrar navegación completa */}
          {isAuthenticated ? (
            <>
              {/* Enlace a Recetas */}
              <a 
                href="/" 
                className="header__nav-link header__nav-link_active"
              >
                Recetas
              </a>

              {/* Enlace a Favoritos */}
              <a 
                href="/favorites" 
                className="header__nav-link"
              >
                Favoritos
              </a>

              {/* Email del usuario */}
              <p className="header__text">
                {currentUser?.email}
              </p>

              {/* Botón de cierre de sesión */}
              <button 
                className="header__logout-btn"
                onClick={handleLogout}
                type="button"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            // Si el usuario NO está autenticado, mostrar enlaces de auth
            <>
              {/* Enlace a Iniciar sesión */}
              <a 
                href="/login" 
                className="header__nav-link"
              >
                Iniciar sesión
              </a>

              {/* Enlace a Registrarse */}
              <a 
                href="/register" 
                className="header__nav-link"
              >
                Registrarse
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;