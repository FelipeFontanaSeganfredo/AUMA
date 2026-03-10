import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { login as apiLogin } from '../../api/api';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token, saveAuth } = useAuth();

  useEffect(() => {
    if (token) navigate('/admin');
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiLogin(email, password);
      const data = await res.json();

      if (res.ok && data.accessToken) {
        saveAuth(data, email);
        Swal.fire({
          icon: 'success',
          title: 'Login bem-sucedido!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          navigate('/admin');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Acesso Negado',
          text: data.message || 'Email ou senha incorretos.'
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'warning', title: 'Erro de Conexão' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-content">
        <div className="login-title">
          <div className="user-logo">
            <img src="/person-icon.png" alt="Ícone de usuário" />
          </div>
          <h1>Login</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">E-mail</label>
          <input 
            type="email" id="email" 
            placeholder="Digite seu email" 
            value={email} onChange={e => setEmail(e.target.value)}
            required 
          />

          <label htmlFor="password">Senha</label>
          <input 
            type="password" id="password" 
            placeholder="Digite sua senha" 
            value={password} onChange={e => setPassword(e.target.value)}
            required 
          />
          
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <p className="forgot-password">Esqueci minha senha</p>
        <p className="create-account">Não tem uma conta? <a href="#">Criar conta</a></p>
      </div>
    </main>
  );
}
