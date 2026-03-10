import './QuemSomos.css';

const values = [
  { img: '/objetividade.png', alt: 'Objetividade', text: 'Objetividade com o alcance de sucesso de todos atendidos.' },
  { img: '/respeito.png',     alt: 'Respeito',     text: 'Respeito no atendimento do "Ser", em primeiro lugar.' },
  { img: '/etica.png',        alt: 'Ética',         text: 'Ética e responsabilidade com a história de vida dos nossos atendidos.' },
  { img: '/trabalho.png',     alt: 'Trabalho',      text: 'Trabalhar todos os dias edificando um futuro com perspectivas de dias cada vez melhores.' },
];

export default function QuemSomos() {
  return (
    <main className="quem-somos-page">
      {/* Elementos de Espaço Premium e Claros (Fundo) */}
      <div className="qs-orbit qs-orbit-1"></div>
      <div className="qs-orbit qs-orbit-2"></div>
      
      {/* SVG Foguete Flutuante Minimalista */}
      <svg className="qs-rocket" viewBox="0 0 24 24" fill="none" stroke="#6666FF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
      
      {/* SVG Satélite Minimalista */}
      <svg className="qs-satellite" viewBox="0 0 24 24" fill="none" stroke="#8A2BE2" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 7 9 3 5 7l4 4"/>
        <path d="m17 11 4 4-4 4-4-4"/>
        <path d="m8 12 4 4 6-6-4-4Z"/>
        <path d="m16 8 3-3"/>
        <path d="M9 21a6 6 0 0 0-6-6"/>
      </svg>

      {/* Pequenas estrelas brilhantes */}
      <div className="qs-star qs-star-1">✦</div>
      <div className="qs-star qs-star-2">✦</div>
      <div className="qs-star qs-star-3">✧</div>

      <div className="qs-corpo">
        <h1 className="qs-title">Nossa História</h1>

        <div className="qs-timeline-container">
          {/* Linha Central Rastro de Foguete */}
          <div className="qs-timeline-line"></div>

          {/* Evento 1 */}
          <div className="qs-timeline-item left">
            <div className="qs-timeline-node"></div>
            <div className="qs-timeline-content">
              <h3>Fundação – 1999</h3>
              <p>
                A Associação dos Amigos da Criança Autista de Passo Fundo <strong>(AUMA)</strong> nasceu em 31 de março de 1999.
                A instituição foi fundada a partir da intensa mobilização de um grupo de pais e amigos de pessoas com autismo em Passo Fundo, Rio Grande do Sul.
              </p>
              <img src="/nuvem_azul.png" alt="Ilustração Fundação" className="timeline-img-small" />
            </div>
          </div>

          {/* Evento 2 */}
          <div className="qs-timeline-item right">
            <div className="qs-timeline-node"></div>
            <div className="qs-timeline-content">
              <h3>Organização e Atuação</h3>
              <p>
                A AUMA atua como uma <strong>Organização da Sociedade Civil</strong>, sem fins lucrativos, voltada à defesa de direitos sociais da comunidade autista.
                Oferecemos suporte em Passo Fundo com atuação municipal e regional. O foco se estende à assistência multiprofissional, reabilitação e integração social.
              </p>
              <img src="/crianca_guria1.png" alt="Criança Atendimento" className="timeline-img-small" />
            </div>
          </div>

          {/* Evento 3 */}
          <div className="qs-timeline-item left">
            <div className="qs-timeline-node"></div>
            <div className="qs-timeline-content">
              <h3>Reconhecimento Público</h3>
              <p>
                A seriedade e o compromisso da nossa instituição nos tornou uma das 54 associações de autistas do Rio Grande do Sul integrantes ativas
                da histórica <strong>Rede Gaúcha Pró-Autismo (RGPA)</strong>, firmando suporte contínuo e visibilidade ao TEA.
              </p>
              <img src="/guri_verde1.png" alt="Reconhecimento" className="timeline-img-small" />
            </div>
          </div>

          {/* Evento 4 */}
          <div className="qs-timeline-item right">
            <div className="qs-timeline-node"></div>
            <div className="qs-timeline-content">
              <h3>Políticas Públicas em Autismo</h3>
              <p>
                Sempre na linha de frente, a AUMA participa ativamente de conquistas locais ligadas ao autismo.
                Isto inclui a estruturação de serviços e uma fundamental articulação com o <strong>Centro Regional de Referência em TEA</strong> no programa TEAcolhe do estado.
              </p>
            </div>
          </div>
        </div>

        <div className="qs-content-block">
          <h2>Nossa Vida & Missão</h2>
          <p>
            A AUMA tem como missão criar programas educacionais de adaptação, integração social e inclusão de
            pessoas autistas com o olhar do ser integral, em que o fazer e o conhecer estão a serviço do ser,
            manifestado em sua pureza e essência das dimensões física, emocional, mental e espiritual.
          </p>
        </div>

        <div className="qs-values-section">
          <h2 className="qs-title">Os Nossos Valores</h2>
          <div className="qs-values-grid">
            {values.map((v) => (
              <div key={v.alt} className="value-card">
                <img src={v.img} alt={v.alt} />
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
