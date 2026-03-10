import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById } from '../../api/api';
import './PaginaNoticia.css';

export default function PaginaNoticia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await getPostById(id);
        if (!res.ok) throw new Error('Notícia não encontrada');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) return <div className="loading-state">Carregando notícia...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!post) return <div className="empty-state">Notícia não encontrada.</div>;

  const dataFormatada = new Date(post.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <main className="pagina-noticia-wrapper">
      <article className="post-container">
        <header className="post-header">
          <button className="btn-voltar" onClick={() => navigate(-1)}>
            ← Voltar
          </button>
          <div className="post-meta">
            <span className="categoria">NOTÍCIA AUMA</span>
            <span className="data">{dataFormatada}</span>
            {post.autor && <span className="autor">Por: {post.autor}</span>}
          </div>
          <h1 className="post-title">{post.title}</h1>
        </header>

        {post.imageUrl && (
          <div className="post-hero-image">
            <img src={post.imageUrl} alt={post.title} onError={(e) => e.target.src = '/auma-logo.png'} />
          </div>
        )}

        {/* Cuidado com injeção de HTML, assumindo que vem limpo do TinyMCE do original */}
        <div 
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <footer className="post-footer">
          <div className="share-section">
            <p>Compartilhar:</p>
            <div className="share-icons">
              <a href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer">
                <img src="/Whatsapp_icon.svg" alt="WhatsApp" />
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer">
                <img src="/Facebook_icon.svg" alt="Facebook" />
              </a>
              <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
                <img src="/Share_icon.svg" alt="Copiar Link" />
              </button>
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}
