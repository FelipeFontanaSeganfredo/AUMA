import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import Home from './pages/Home/Home';
import QuemSomos from './pages/QuemSomos/QuemSomos';
import Contato from './pages/Contato/Contato';
import Noticias from './pages/Noticias/Noticias';
import PaginaNoticia from './pages/PaginaNoticia/PaginaNoticia';
import Produtos from './pages/Produtos/Produtos';
import ProdutoDetalhe from './pages/ProdutoDetalhe/ProdutoDetalhe';
import Parceiros from './pages/Parceiros/Parceiros';
import Doacoes from './pages/Doacoes/Doacoes';
import Login from './pages/Login/Login';
import Admin from './pages/Admin/Admin';

export default function App() {
  return (
    <>
      <Header />
      <div className="page-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:id" element={<PaginaNoticia />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/:id" element={<ProdutoDetalhe />} />
          <Route path="/parceiros" element={<Parceiros />} />
          <Route path="/doacoes" element={<Doacoes />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          {/* Create/Edit routes left out for brevity as per instructions, or redirect to admin */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
