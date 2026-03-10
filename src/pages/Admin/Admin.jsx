import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../api/api';
import Pagination from '../../components/Pagination/Pagination';
import './Admin.css';

export default function Admin() {
  const { token, userRole, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const [currentSection, setCurrentSection] = useState('posts');
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estados do formulário inline
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'create' | 'edit'
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [formData, setFormData] = useState({});

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  // Carrega itens 
  const fetchItems = async () => {
    setLoading(true);
    try {
      const endpoint = `${API_BASE_URL}/${currentSection}?page=${currentPage}&size=10`;
      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Falha ao buscar dados');
      
      const data = await response.json();
      setItems(data.content || data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Erro', text: 'Erro ao carregar dados.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && viewMode === 'list') fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection, currentPage, token, viewMode]);

  const handleMenuClick = (section) => {
    setCurrentSection(section);
    setCurrentPage(0);
    setViewMode('list');
  };

  const handleCreate = () => {
    if (currentSection === 'users' && userRole !== 'SUPERADMIN') return;
    setFormData({});
    setViewMode('create');
  };

  const handleEdit = (id) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    setFormData({ ...item });
    setSelectedItemId(id);
    setViewMode('edit');
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Isso não pode ser desfeito!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE_URL}/${currentSection}/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          Swal.fire('Excluído!', 'O item foi excluído.', 'success');
          fetchItems();
        } else {
          Swal.fire('Erro', 'Não foi possível excluir.', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Erro', 'Erro de conexão.', 'error');
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageBase64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const isEdit = viewMode === 'edit';
      const url = isEdit ? `${API_BASE_URL}/${currentSection}/${selectedItemId}` : `${API_BASE_URL}/${currentSection}`;
      const method = isEdit ? 'PUT' : 'POST';

      // Inclui userEmail para novos itens (exceto usuários e parceiros dependendo do back, mas parceiro ignora extras)
      const payload = { ...formData };
      if (!isEdit && currentSection !== 'users') {
        payload.userEmail = userEmail;
      }

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(()=>({ message: 'Erro desconhecido'}));
        throw new Error(errData.message || 'Falha ao salvar');
      }

      Swal.fire('Sucesso!', 'Informações salvas com sucesso.', 'success');
      setViewMode('list');
    } catch (err) {
      Swal.fire('Erro', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (currentSection === 'posts') return 'Notícias';
    if (currentSection === 'products') return 'Produtos';
    if (currentSection === 'partners') return 'Parceiros';
    if (currentSection === 'users') return 'Usuários';
  };

  const renderForm = () => {
    return (
      <div className="admin-form-split-view">
        <form onSubmit={handleFormSubmit} className="admin-form-container">
          <div className="admin-form-header">
            <h2>{viewMode === 'edit' ? 'Editar' : 'Criar'} {getTitle()}</h2>
            <button type="button" className="btn-cancel" onClick={() => setViewMode('list')}>Voltar</button>
          </div>

        {currentSection === 'users' && (
          <>
            <label>Email:</label>
            <input type="email" required value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={viewMode === 'edit'} />
            
            {viewMode === 'create' && (
              <>
                <label>Senha:</label>
                <input type="password" required value={formData.password || ''} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </>
            )}

            <label>Role:</label>
            <select value={formData.role || 'ADMIN'} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPERADMIN">SUPERADMIN</option>
            </select>
          </>
        )}

        {currentSection === 'posts' && (
          <>
            <label>Título:</label>
            <input type="text" required value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            
            <label>Conteúdo:</label>
            <textarea required rows="6" value={formData.content || ''} onChange={(e) => setFormData({...formData, content: e.target.value})}></textarea>
            
            <label>Imagem (Opcional):</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {formData.imageBase64 && <img src={formData.imageBase64} alt="Preview" className="img-preview" />}
            {!formData.imageBase64 && formData.imageUrl && <img src={formData.imageUrl} alt="Current" className="img-preview" />}
          </>
        )}

        {currentSection === 'products' && (
          <>
            <label>Nome do Produto:</label>
            <input type="text" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            
            <label>Dimensões (Ex: P, M, G, ou 10x10):</label>
            <input type="text" required value={formData.dimension || ''} onChange={(e) => setFormData({...formData, dimension: e.target.value})} />

            <label>Categoria:</label>
            <input type="text" required value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} />

            <label>Gênero:</label>
            <select required value={formData.gender || 'unissex'} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option value="unissex">Unissex</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
            </select>

            <label>Descrição:</label>
            <textarea rows="4" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>

            <label>Imagem (Opcional):</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {formData.imageBase64 && <img src={formData.imageBase64} alt="Preview" className="img-preview" />}
            {!formData.imageBase64 && formData.imageUrl && <img src={formData.imageUrl} alt="Current" className="img-preview" />}
          </>
        )}

        {currentSection === 'partners' && (
          <>
            <label>Nome do Parceiro:</label>
            <input type="text" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            
            <label>URL do Parceiro (Link):</label>
            <input type="url" required value={formData.partnerUrl || formData.partner_url || ''} onChange={(e) => setFormData({...formData, partnerUrl: e.target.value})} />

            <label>Logomarca (Recomendado):</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {formData.imageBase64 && <img src={formData.imageBase64} alt="Preview" className="img-preview" />}
            {!formData.imageBase64 && formData.imageUrl && <img src={formData.imageUrl} alt="Current" className="img-preview" />}
          </>
        )}

        <button type="submit" className="btn-save" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>

      {/* ----------- LIVE PREVIEW SIDEBAR ----------- */}
      <div className="admin-preview-container">
        <h3>Live Preview</h3>
        <p className="preview-help">Veja como esse item aparecerá no site</p>
        
        <div className="preview-card-wrapper">
          
          {/* Preview Notícia */}
          {currentSection === 'posts' && (
            <div className="preview-news-card" style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '100%', height: '180px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img 
                  src={formData.imageBase64 || formData.imageUrl || '/auma-logo.png'} 
                  alt="Preview Notícia" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h4 style={{ fontFamily: 'Nova Square', margin: '0 0 10px 0', color: '#1d1d1f' }}>
                  {formData.title || 'Título da Notícia...'}
                </h4>
                <p style={{ color: '#555', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {formData.content || 'O conteúdo da notícia vai aparecer aqui...'}
                </p>
                <div style={{ marginTop: '15px', color: '#6666FF', fontWeight: 'bold', fontSize: '0.9rem' }}>Leia mais →</div>
              </div>
            </div>
          )}

          {/* Preview Produto */}
          {currentSection === 'products' && (
            <div className="preview-product-card" style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
               <div style={{ width: '100%', height: '200px', backgroundColor: '#f9f9fb', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src={formData.imageBase64 || formData.imageUrl || '/auma-logo.png'} 
                  alt="Preview Produto" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h4 style={{ fontFamily: 'Nova Square', margin: '0 0 10px 0', color: '#1d1d1f' }}>
                  {formData.name || 'Nome do Produto...'}
                </h4>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '10px 0', flexWrap: 'wrap' }}>
                  <span style={{ background: '#eee', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{formData.dimension || 'Dimensão'}</span>
                  <span style={{ background: '#e0e0ff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#4444cc' }}>{formData.category || 'Categoria'}</span>
                </div>
                <p style={{ color: '#555', fontSize: '0.9rem', margin: '0' }}>{formData.description || 'Breve descrição...'}</p>
              </div>
            </div>
          )}

          {/* Preview Parceiro */}
          {currentSection === 'partners' && (
            <div className="preview-partner-card" style={{ background: '#fff', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
               <div style={{ width: '120px', height: '120px', backgroundColor: '#f0f0f0', borderRadius: '50%', margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img 
                  src={formData.imageBase64 || formData.imageUrl || '/auma-logo.png'} 
                  alt="Preview Parceiro" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: '10px' }}
                />
              </div>
              <h4 style={{ fontFamily: 'Nova Square', margin: '0 0 10px 0', color: '#1d1d1f' }}>
                {formData.name || 'Nome do Parceiro'}
              </h4>
              <a href="#" style={{ color: '#0066cc', fontSize: '0.9rem', textDecoration: 'none' }}>
                {formData.partnerUrl || 'www.siteparceiro.com.br'}
              </a>
            </div>
          )}

          {/* Preview Usuário */}
          {currentSection === 'users' && (
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px dashed #ccc' }}>
              <p style={{ color: '#555', textAlign: 'center' }}>Sem preview visual para usuários do sistema.</p>
            </div>
          )}

        </div>
      </div>
    </div>
    );
  };

  if (!token) return null;

  return (
    <main className="admin-page-wrapper">
      <aside className="admin-sidebar">
        <h3>Painel Admin</h3>
        <ul className="sidebar-menu">
          <li className={currentSection === 'posts' ? 'active' : ''} onClick={() => handleMenuClick('posts')}>Notícias</li>
          <li className={currentSection === 'products' ? 'active' : ''} onClick={() => handleMenuClick('products')}>Produtos</li>
          <li className={currentSection === 'partners' ? 'active' : ''} onClick={() => handleMenuClick('partners')}>Parceiros</li>
          {userRole === 'SUPERADMIN' && (
            <li className={currentSection === 'users' ? 'active' : ''} onClick={() => handleMenuClick('users')}>Usuários</li>
          )}
        </ul>
        <button className="logout-btn-sidebar" onClick={() => { logout(); navigate('/login'); }}>Sair do Sistema</button>
      </aside>

      <section className="admin-content">
        {viewMode === 'list' ? (
          <>
            <div className="section-header">
              <h2>Gerenciar {getTitle()}</h2>
              <button className="btn-create" onClick={handleCreate}>+ Criar {getTitle()}</button>
            </div>

            <div className="items-grid">
              {loading ? (
                <p className="loading-state">Carregando...</p>
              ) : items.length === 0 ? (
                <p className="empty-state">Nenhum item encontrado.</p>
              ) : (
                items.map(item => {
                  if (currentSection === 'users' && item.email === userEmail) return null;
                  const imgUrl = item.imageUrl || '/auma-logo.png';
                  const title = item.title || item.name || item.email;

                  return (
                    <div key={item.id} className="admin-card">
                      {currentSection !== 'users' && (
                        <div className="admin-card-img">
                          <img src={imgUrl} alt={title} onError={(e) => e.target.src = '/auma-logo.png'} />
                        </div>
                      )}
                      <h4>{title}</h4>
                      <div className="card-actions">
                        <button className="btn-edit" onClick={() => handleEdit(item.id)}>Editar</button>
                        <button className="btn-delete" onClick={() => handleDelete(item.id)}>Excluir</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </>
        ) : (
          renderForm()
        )}
      </section>
    </main>
  );
}
