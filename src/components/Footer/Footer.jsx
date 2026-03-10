import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/contato', label: 'Contato' },
    { to: '/quem-somos', label: 'Quem somos' },
    { to: '/noticias', label: 'Notícias' },
    { to: '/produtos', label: 'Produtos' },
    { to: '/parceiros', label: 'Parceiros' },
    { to: '/doacoes', label: 'Doar' },
    { to: '/login', label: 'Administração' },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Coluna 1: Sobre e Logo */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo-link">
            <img src="/auma-logo.png" alt="AUMA Logo" className="footer-auma-logo" />
            <span className="footer-brand-name">AUMA</span>
          </Link>
          <p className="footer-description">
            Associação dos Amigos da Criança Autista de Passo Fundo. 
            Dedicada à defesa de direitos e suporte às pessoas com TEA e suas famílias.
          </p>
          <div className="institution-info">
            <img src="/logoIF.png" alt="Logo IF Sul-Rio-Grandense" className="imageIF" />
          </div>
        </div>

        {/* Coluna 2: Navegação */}
        <div className="footer-nav">
          <h4 className="footer-title">Navegação</h4>
          <ul className="footer-nav-list">
            {navLinks.slice(0, 4).map(({ to, label }) => (
              <li key={to}><Link to={to}>{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Coluna 3: Institucional */}
        <div className="footer-nav">
          <h4 className="footer-title">Institucional</h4>
          <ul className="footer-nav-list">
            {navLinks.slice(4).map(({ to, label }) => (
              <li key={to}><Link to={to}>{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Coluna 4: Contato e Social */}
        <div className="footer-contact-area">
          <h4 className="footer-title">Conecte-se</h4>
          <ul className="footer-contact-list">
            <li>
              <a href="mailto:aumapf@gmail.com">
                <svg className="footer-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                aumapf@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:54996581732">
                <svg className="footer-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                54 99658-1732
              </a>
            </li>
          </ul>
          <div className="footer-social">
            <a href="https://facebook.com/aumapf" target="_blank" rel="noreferrer" className="social-pill">
              <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
              </svg>
            </a>
            <a href="https://instagram.com/aumapf" target="_blank" rel="noreferrer" className="social-pill">
              <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} AUMA Passo Fundo. Todos os direitos reservados.</p>
        <span className="cosmic-divider">✦</span>
        <p>Desenvolvido com carinho para a comunidade autista.</p>
      </div>
    </footer>
  );
}
