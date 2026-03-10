import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPartners } from '../../api/api';
import './Parceiros.css';

export default function Parceiros() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getPartners(0, 100);
        if (!res.ok) throw new Error('Não foi possível carregar parceiros.');
        const data = await res.json();
        setPartners(data.content || data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <main className="partners-section">
      <h1 className="partners-title">Nossos Parceiros</h1>

      <div className="partners-grid" id="partners-grid">
        {loading ? (
          <p className="loading-state">Carregando parceiros...</p>
        ) : error ? (
          <p className="error-state">{error}</p>
        ) : partners.length === 0 ? (
          <p className="empty-state">Nenhum parceiro cadastrado ainda.</p>
        ) : (
          partners.map(partner => (
            <a
              key={partner.id}
              className="partner-item"
              href={partner.partnerUrl || '#'}
              target={partner.partnerUrl ? '_blank' : '_self'}
              rel="noreferrer"
              onClick={(e) => { if (!partner.partnerUrl) e.preventDefault(); }}
            >
              <div className="partner-img-box">
                <img 
                  src={partner.imageUrl || '/auma-logo.png'} 
                  alt={partner.name || 'Parceiro AUMA'} 
                  onError={(e) => e.target.src = '/auma-logo.png'}
                />
              </div>
              <h3 className="partner-name">{partner.name || 'Parceiro AUMA'}</h3>
            </a>
          ))
        )}
      </div>

      <div className="cta-banner">
        <p>Quer ser nosso parceiro?</p>
        <button onClick={() => navigate('/contato')} className="cta-button">Entre em contato</button>
      </div>
    </main>
  );
}
