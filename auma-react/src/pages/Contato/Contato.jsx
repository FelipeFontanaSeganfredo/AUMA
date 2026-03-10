import { useState } from 'react';
import './Contato.css';

const slides = [
  {
    id: 'social',
    title: 'Redes sociais:',
    content: (
      <ul className="social-list">
        <li>
          <a href="https://www.facebook.com/p/AUMA-Assoc-Autismo-Passo-Fundo-100066780890566/?locale=pt_BR" target="_blank" rel="noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            Facebook AUMA
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/aumapf/" target="_blank" rel="noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            @aumapf
          </a>
        </li>
        <li>
          <a href="https://wa.me/5554996581732" target="_blank" rel="noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            WhatsApp AUMA
          </a>
        </li>
      </ul>
    ),
  },
  {
    id: 'phone',
    title: 'Telefone:',
    content: (
      <ul className="contact-info-list">
        <li>
          <a href="tel:54996581732">
            <span role="img" aria-label="telefone" style={{ fontSize: '1.4rem' }}>📞</span> 
            (54) 99658-1732
          </a>
        </li>
        <li>
          <a href="https://wa.me/5554996581732" target="_blank" rel="noreferrer">
            <span role="img" aria-label="mensagem" style={{ fontSize: '1.4rem' }}>💬</span> 
            Contate-nos pelo WhatsApp!
          </a>
        </li>
      </ul>
    ),
  },
  {
    id: 'quote',
    title: '',
    content: (
      <div className="quote-content">
        <p>"Enquanto existir amor, não haverá diferenças."</p>
        <img src="/criancas_tres.png" alt="Crianças" />
      </div>
    ),
  },
];

export default function Contato() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({ nome: '', email: '', mensagem: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrar com backend de e-mail
    setSent(true);
    setFormData({ nome: '', email: '', mensagem: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <main className="contact-page">
      {/* Elementos Lúdicos Espaciais no Background */}
      <div className="contact-space-bg" aria-hidden="true">
        <svg className="floating-planet" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="60" fill="#f0f0f5" />
          <path d="M40 100 Q100 140 160 100" stroke="#e0e0e5" strokeWidth="8" fill="none" strokeLinecap="round" />
          <circle cx="80" cy="80" r="8" fill="#e0e0e5" />
          <circle cx="120" cy="110" r="12" fill="#e0e0e5" />
          <circle cx="70" cy="115" r="5" fill="#e0e0e5" />
        </svg>

        <svg className="light-star star-pos-1" viewBox="0 0 24 24" fill="#e0e0f0" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
        <svg className="light-star star-pos-2" viewBox="0 0 24 24" fill="#e5e5f5" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
        <svg className="light-star star-pos-3" viewBox="0 0 24 24" fill="#ebebfa" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
      </div>

      <div className="contact-header-wrapper">
        <h1 className="contact-main-title">Fale Conosco</h1>
        <p className="contact-subtitle">Estamos prontos para ouvir você e construir um futuro melhor juntos.</p>
      </div>

      <div className="contact-container">
        {/* Formulário */}
        <div className="form-container">
          <h2>Envie um email:</h2>
          {sent && <div className="success-msg">✅ Mensagem enviada com sucesso!</div>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="nome">Nome:</label>
            <input
              type="text" id="nome" value={formData.nome}
              placeholder="Digite seu nome" required
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email" id="email" value={formData.email}
              placeholder="Digite seu email" required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <label htmlFor="mensagem">Mensagem:</label>
            <textarea
              id="mensagem" rows="6" value={formData.mensagem}
              placeholder="Digite sua mensagem" required
              onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
            />
            <button className="submit-button" type="submit">Enviar</button>
          </form>
        </div>

        {/* Carrossel */}
        <div className="social-container">
          <div className="carousel-wrapper">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentSlide * (100 / slides.length)}%)`, width: `${slides.length * 100}%` }}
            >
              {slides.map((slide) => (
                <div key={slide.id} className="carousel-slide" style={{ width: `${100 / slides.length}%` }}>
                  {slide.title && <h2>{slide.title}</h2>}
                  {slide.content}
                </div>
              ))}
            </div>
          </div>
          <div className="pagination-dots">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`dot${i === currentSlide ? ' active' : ''}`}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
