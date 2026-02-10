document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://auma-api-9w04.onrender.com';
    
    // Texto de preenchimento mockado
    const loremIpsumText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;

    const destaquePrincipalContainer = document.getElementById('destaque-principal-container');
    const destaqueSecundarioContainer = document.getElementById('destaque-secundario-container');
    const noticiasMenoresContainer = document.getElementById('noticias-menores-container');

    try {
        const response = await fetch(`${API_BASE_URL}/posts?page=0&size=10`);
        if (!response.ok) throw new Error("Erro ao carregar notícias.");

        const data = await response.json();
        const posts = data.content || []; // ✅ API retorna {content: [...]}

        if (posts.length === 0) {
            destaquePrincipalContainer.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
            destaqueSecundarioContainer.innerHTML = '';
            noticiasMenoresContainer.innerHTML = '';
            return;
        }

        // ✅ Limpa containers
        destaquePrincipalContainer.innerHTML = '';
        destaqueSecundarioContainer.innerHTML = '';
        noticiasMenoresContainer.innerHTML = '';

        // ✅ PRIMEIRO POST - Destaque Principal
        const primeiroPost = posts[0];
        const textoPrincipal = primeiroPost.content?.trim() || loremIpsumText;
        
        destaquePrincipalContainer.innerHTML = `
            <article class="destaque-principal noticia-destaque" onclick="window.location.href='../PaginaNoticia/paginaNoticia.html?id=${primeiroPost.id}'">
                ${primeiroPost.imageUrl ? `<img src="${primeiroPost.imageUrl}" alt="${primeiroPost.title}">` : ''}
                <div class="noticia-overlay">
                    <span class="categoria">GERAL</span>
                    <h2>${primeiroPost.title}</h2>
                    <p class="resumo">${textoPrincipal.substring(0, 100)}...</p>
                    <p class="data">${new Date(primeiroPost.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
            </article>
        `;

        // ✅ SEGUNDO POST - Destaque Secundário
        if (posts.length > 1) {
            const segundoPost = posts[1];
            const textoSecundario = segundoPost.content?.trim() || loremIpsumText;
            
            destaqueSecundarioContainer.innerHTML = `
                <article class="destaque-secundario noticia-destaque" onclick="window.location.href='../PaginaNoticia/paginaNoticia.html?id=${segundoPost.id}'">
                    ${segundoPost.imageUrl ? `<img src="${segundoPost.imageUrl}" alt="${segundoPost.title}">` : ''}
                    <div class="noticia-overlay">
                        <span class="categoria">GERAL</span>
                        <h2>${segundoPost.title}</h2>
                        <p class="resumo">${textoSecundario.substring(0, 80)}...</p>
                        <p class="data">${new Date(segundoPost.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                </article>
            `;
        }
        
        // ✅ DEMAIS POSTS - Notícias menores
        if (posts.length > 2) {
            posts.slice(2).forEach(post => {
                const article = document.createElement('article');
                article.classList.add('noticia-menor');
                article.onclick = () => window.location.href = `../PaginaNoticia/paginaNoticia.html?id=${post.id}`;
                
                const textoMenor = post.content?.trim() || loremIpsumText;
                
                article.innerHTML = `
                    ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}">` : ''}
                    <div class="noticia-menor-content">
                        <span class="categoria">GERAL</span>
                        <h3>${post.title}</h3>
                        <p class="data">${new Date(post.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                `;
                noticiasMenoresContainer.appendChild(article);
            });
        }

    } catch (error) {
        console.error("Erro ao carregar notícias:", error);
        destaquePrincipalContainer.innerHTML = '<p>Erro ao carregar notícias.</p>';
    }
});
