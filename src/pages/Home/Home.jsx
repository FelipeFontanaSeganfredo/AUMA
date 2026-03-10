import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="top-section">
        <div className="container">
          {/* SVG Moon Surface Background (Bottom aligned) */}
          <div className="moon-container" aria-hidden="true">
            {/* Camada traseira da lua */}
            <svg className="moon-back" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="#EBEBEB" d="M0,192 Q120,120 280,180 T600,160 T920,200 T1240,150 T1440,192 L1440,320 L0,320 Z"></path>
              {/* Crateras */}
              <ellipse cx="150" cy="220" rx="40" ry="15" fill="#E0E0E0" />
              <ellipse cx="400" cy="260" rx="60" ry="20" fill="#E0E0E0" />
              <ellipse cx="850" cy="230" rx="30" ry="10" fill="#E0E0E0" />
              <ellipse cx="1150" cy="270" rx="70" ry="25" fill="#E0E0E0" />
            </svg>

            {/* Camada frontal da lua */}
            <svg className="moon-front" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="#F5F5F5" d="M0,256 Q150,200 320,260 T680,220 T1040,270 T1340,230 L1440,256 L1440,320 L0,320 Z"></path>
              {/* Crateras frontais */}
              <ellipse cx="250" cy="290" rx="55" ry="18" fill="#EBEBEB" />
              <ellipse cx="700" cy="280" rx="85" ry="28" fill="#EBEBEB" />
              <ellipse cx="1300" cy="300" rx="45" ry="15" fill="#EBEBEB" />
            </svg>
          </div>

          {/* Conteúdo esquerdo reforçado com emoção e clareza */}
          <div className="content-left">
            <h1 className="main-title">
              O futuro deles também <span className="text-highlight">depende de você</span>
            </h1>
            <p className="hero-subtitle">
              A AUMA acolhe, desenvolve e integra autistas à sociedade.
              Há mais de 30 anos nossa missão é provar que o autismo não é o fim,
              mas sim uma forma única de ver o mundo.
            </p>
            <div className="hero-actions">
              <button className="donate-btn" onClick={() => navigate('/doacoes')}>
                Quero Doar Agora
              </button>
              <button className="secondary-btn" onClick={() => navigate('/quem-somos')}>
                Conheça nossa missão
              </button>
            </div>

            <div className="trust-indicators">
              <span>💙 +30 Anos de atuação</span>
              <span className="dot-divider">•</span>
              <span>🤝 Vidas transformadas</span>
            </div>
          </div>

          {/* Astronauta com background celestial isolado */}
          <div className="astronaut-container">
            <div className="astronaut-glow-ring"></div>
            <img src="/astronaut.png" alt="Mascote Astronauta AUMA voando pelo universo" className="astronaut" />
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="bottom-section">
        <div className="bottom-right">
          <img src="/kids.png" alt="Crianças felizes" />
        </div>
        <div className="bottom-left">
          <img src="/autism.png" alt="Símbolo autismo" className="autism-icon" />
          <p className="bottom-quote">
            O autista vê o mundo de um ângulo diferente. A AUMA vê o mesmo ângulo.
          </p>
          <button className="action-btn" onClick={() => navigate('/quem-somos')}>
            Conferir atuação
          </button>
        </div>
      </section>
    </main>
  );
}
