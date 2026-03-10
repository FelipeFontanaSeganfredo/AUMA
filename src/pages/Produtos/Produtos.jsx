import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProducts } from '../../api/api';
import Pagination from '../../components/Pagination/Pagination';
import './Produtos.css';

export default function Produtos() {
  const [products, setProducts] = useState([]);
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
        const res = await getProducts(currentPage, 16);
        if (!res.ok) throw new Error('Falha ao carregar produtos');
        const data = await res.json();
        setProducts(data.content || []);
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

  return (
    <main className="produtos-page content">
      <div className="page-header">
        <h1 className="main-title">Produtos</h1>
        <div className="search-filter">
          <input type="text" className="search-input" placeholder="Pesquisar produtos..." disabled />
          <select className="filter-select" disabled>
            <option value="">Todos os Tipos</option>
          </select>
        </div>
      </div>

      <div className="main-grid">
        <aside className="sidebar">
          <h3>Categorias</h3>
          <ul>
            <li><a href="#">Eletrônicos</a></li>
            <li><a href="#">Roupas</a></li>
            <li><a href="#">Acessórios</a></li>
            <li><a href="#">Artesanato</a></li>
          </ul>
          <h3>Tamanho</h3>
          <ul>
            <li><a href="#">P</a></li>
            <li><a href="#">M</a></li>
            <li><a href="#">G</a></li>
            <li><a href="#">GG</a></li>
          </ul>
        </aside>

        <div className="products-area">
          {loading ? (
            <div className="loading-state">Carregando produtos...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : products.length === 0 ? (
            <div className="empty-state">Nenhum produto encontrado.</div>
          ) : (
            <>
              <section className="products-grid">
                {products.map(product => {
                  const imageUrl = product.imageUrl || '/auma-logo.png';
                  const imageStyle = product.imageUrl ? {} : { opacity: 0.3, padding: 40 };

                  return (
                    <div 
                      key={product.id} 
                      className="product-card" 
                      onClick={() => navigate(`/produtos/${product.id}`)}
                    >
                      <div className="product-image-box">
                        <img src={imageUrl} alt={product.name} style={imageStyle} />
                      </div>
                      <div className="product-info">
                        <h3>{product.name || 'Produto Sem Nome'}</h3>
                        <p className="category">{product.category || 'Geral'} | {product.dimension || 'Único'}</p>
                        <p className="gender">{product.gender || 'Unissex'}</p>
                        <button className="product-button">Ver Detalhes</button>
                      </div>
                    </div>
                  );
                })}
              </section>
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
