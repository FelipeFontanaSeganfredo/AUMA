import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../api/api';
import './ProdutoDetalhe.css';

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await getProductById(id);
        if (!res.ok) throw new Error('Produto não encontrado');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) return <div className="loading-state">Carregando detalhes do produto...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!product) return <div className="empty-state">Produto não encontrado.</div>;

  const imageUrl = product.imageUrl || '/auma-logo.png';

  return (
    <main className="produto-detalhe-page">
      <div className="pd-container">
        <button className="btn-voltar" onClick={() => navigate(-1)}>← Voltar aos produtos</button>
        
        <div className="pd-grid">
          {/* Image */}
          <div className="pd-image-section">
            <img src={imageUrl} alt={product.name} />
          </div>

          {/* Info */}
          <div className="pd-info-section">
            <span className="pd-category">{product.category || 'Categoria Geral'}</span>
            <h1 className="pd-title">{product.name}</h1>
            
            <div className="pd-meta">
              <p><strong>Gênero:</strong> {product.gender || 'Unissex'}</p>
              <p><strong>Dimensão/Tamanho:</strong> {product.dimension || 'Tamanho Único'}</p>
            </div>

            <div className="pd-description">
              <h3>Descrição Oficial do Produto</h3>
              <p>{product.description || 'Este produto apoia diretamente as causas da AUMA. Ao adquiri-lo, você ajuda a manter nossos serviços ativos.'}</p>
            </div>

            <div className="pd-action">
              <button 
                className="pd-buy-btn"
                onClick={() => window.open(`https://wa.me/5554996581732?text=Olá, tenho interesse no produto: ${product.name}`, '_blank')}
              >
                Comprar / Encomendar via WhatsApp
              </button>
            </div>
            
            <p className="pd-disclaimer">O pagamento e retirada devem ser combinados devidamente pelo WhatsApp da instituição.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
