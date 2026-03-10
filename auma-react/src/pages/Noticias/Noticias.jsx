import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPosts } from '../../api/api';
import Pagination from '../../components/Pagination/Pagination';
import './Noticias.css';

export default function Noticias() {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '0', 10);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await getPosts(currentPage, 10);
        if (!res.ok) throw new Error('Falha ao carregar notícias');
        const data = await res.json();
        setPosts(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const stripHtml = (html, max = 150) => {
    if (!html) return '';
    const text = html.replace(/<[^>]*>?/gm, '');
    return text.length > max ? text.substring(0, max) + '...' : text;
  };

  const renderHighlight = (post, className) => (
    <article
      key={post.id}
      className={`${className} noticia-destaque`}
      onClick={() => navigate(`/noticias/${post.id}`)}
    >
      <img src={post.imageUrl || '/imagemNoticia.png'} alt={post.title} onError={(e) => e.target.src = '/auma-logo.png'} />
      <div className="noticia-overlay">
        <span className="categoria">DESTAQUE</span>
        <h2>{post.title}</h2>
        <p className="resumo">{stripHtml(post.content, 100)}</p>
        <p className="data">{new Date(post.created_at).toLocaleDateString('pt-BR')}</p>
      </div>
    </article>
  );

  const renderSmallCard = (post) => (
    <article
      key={post.id}
      className="noticia-menor"
      onClick={() => navigate(`/noticias/${post.id}`)}
    >
      <div className="noticia-menor-img-box">
        <img src={post.imageUrl || '/imagemNoticia.png'} alt={post.title} onError={(e) => e.target.src = '/auma-logo.png'} />
      </div>
      <div className="noticia-menor-content">
        <span className="categoria">NOTÍCIA</span>
        <h3>{post.title}</h3>
        <p className="resumo">{stripHtml(post.content)}</p>
        <p className="data">{new Date(post.created_at).toLocaleDateString('pt-BR')}</p>
      </div>
    </article>
  );

  return (
    <main className="noticias-page">
      {loading ? (
        <div className="loading-state">Carregando destaques...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">Nenhuma notícia encontrada.</div>
      ) : (
        <>
          {currentPage === 0 ? (
            <>
              <section className="destaque-section">
                {posts[0] && renderHighlight(posts[0], 'destaque-principal')}
                {posts[1] && renderHighlight(posts[1], 'destaque-secundario')}
              </section>
              <section className="noticias-secundarias">
                <div className="noticias-menores">
                  {posts.slice(2).map(renderSmallCard)}
                </div>
              </section>
            </>
          ) : (
            <section className="noticias-secundarias">
              <div className="noticias-menores">
                {posts.map(renderSmallCard)}
              </div>
            </section>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}
