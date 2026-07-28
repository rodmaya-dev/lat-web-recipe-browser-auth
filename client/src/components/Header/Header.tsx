import { NavLink } from 'react-router-dom';

import Logo from '../../assets/logo.svg';
import './Header.css';

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? 'header__nav-link header__nav-link_active'
    : 'header__nav-link';
}

function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <img src={Logo} alt="Logo de Buscador de recetas" className="header__logo" />
        <nav className="header__nav">
          <NavLink to="/" className={getNavLinkClass}>
            Recetas
          </NavLink>
          <NavLink to="/favorites" className={getNavLinkClass}>
            Favoritos
          </NavLink>
          <NavLink to="/login" className={getNavLinkClass}>
            Iniciar sesión
          </NavLink>
          <NavLink to="/register" className={getNavLinkClass}>
            Registrarse
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
