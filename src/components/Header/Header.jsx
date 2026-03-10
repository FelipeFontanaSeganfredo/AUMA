import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export default function Header() {
  const { token, userName, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('.user-menu-container')) setDropdownOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/contato', label: 'Contato' },
    { to: '/quem-somos', label: 'Quem somos' },
    { to: '/noticias', label: 'Notícias' },
    { to: '/produtos', label: 'Produtos' },
    { to: '/parceiros', label: 'Parceiros' },
  ];

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      {/* Hamburguer mobile */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(true)}
        aria-label="Abrir menu"
      >
        ☰
      </button>

      {/* Logo */}
      <div className="logo">
        <Link to="/">
          <img src="/auma-logo.png" alt="AUMA Logo" />
        </Link>
      </div>

      {/* Nav Desktop */}
      <nav className="desktop-nav">
        <ul>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => isActive ? 'active-link' : ''}
                end={to === '/'}
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link to="/doacoes" className="doar-button">DOAR</Link>
          </li>

          {token && (
            <li>
              <div className="user-menu-container">
                <button className="user-btn" onClick={() => setDropdownOpen(o => !o)}>
                  <img src="/person-icon.png" alt="user" style={{ width: 20 }} />
                  {userName} ▼
                </button>
                {dropdownOpen && (
                  <div className="dropdown-content">
                    <Link to="/admin">Painel Admin</Link>
                    <button onClick={handleLogout}>Sair</button>
                  </div>
                )}
              </div>
            </li>
          )}
        </ul>
      </nav>

      {/* Sidebar mobile */}
      <div className={`nav-menu${menuOpen ? ' open' : ''}`}>
        <button className="close-menu" onClick={() => setMenuOpen(false)}>×</button>
        <ul>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} onClick={() => setMenuOpen(false)} end={to === '/'}>
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link to="/doacoes" className="doar-button-mobile" onClick={() => setMenuOpen(false)}>DOAR</Link>
          </li>
          {token && (
            <li>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="logout-mobile">
                Sair
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}
    </header>
  );
}
