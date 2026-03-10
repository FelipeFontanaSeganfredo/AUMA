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
      <div className="qs-corpo">
        <h1 className="qs-title">História</h1>

        <div className="qs-illustration">
          <p>
            A AUMA – Associação dos Amigos da Criança Autista – é uma entidade assistencial, sem fins lucrativos,
            fundada na cidade de São Paulo em 25 de janeiro de 1990 com o intuito de preencher parte de uma lacuna
            existente nas redes educacionais brasileiras, tanto públicas como privadas.
          </p>
          <img src="/nuvem_azul.png" alt="Ilustração nuvem azul" />
        </div>

        <div className="qs-illustration reverse">
          <img src="/crianca_guria1.png" alt="Criança" />
          <p>
            Nascida da dificuldade de Eliana Boralli em encontrar atendimento especializado para sua filha autista.
            No início, os trabalhos foram desenvolvidos três meses na residência da fundadora e depois, uma sala foi
            cedida em outra entidade (Ruta de Souza) e, posteriormente, através da Campanha "Pingo de Gente" da
            Lorenzetti, adquiriu-se a sede própria.
          </p>
        </div>

        <div className="qs-illustration">
          <p>
            O programa da AUMA inclui: Educação Especializada para pessoas autistas por meio do CEAACA – Centro
            Educacional da Associação dos Amigos da Criança Autista Nathália Boralli, atendimento de orientação,
            encaminhamento e treinamento de familiares, capacitação e orientação de profissionais interessados e
            estudantes, esclarecimento à comunidade em geral por meio da divulgação do tema autismo em jornais,
            revistas, televisão e rádio.
          </p>
          <img src="/guri_verde1.png" alt="Criança verde" />
        </div>

        <div className="qs-content-block">
          <h2>Missão</h2>
          <p>
            A AUMA tem como missão criar programas educacionais de adaptação, integração social e inclusão de
            pessoas autistas com o olhar do ser integral, em que o fazer e o conhecer estão a serviço do ser,
            manifestado em sua pureza e essência das dimensões física, emocional, mental e espiritual.
          </p>
        </div>

        <div className="qs-values-section">
          <h2 className="qs-title">Valores</h2>
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
