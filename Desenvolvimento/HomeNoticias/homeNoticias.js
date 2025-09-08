document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://auma-api.onrender.com';
    
    // Texto de preenchimento mockado com Lorem Ipsum
    const loremIpsumText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

    const destaquePrincipalContainer = document.getElementById('destaque-principal-container');
    const destaqueSecundarioContainer = document.getElementById('destaque-secundario-container');
    const noticiasMenoresContainer = document.getElementById('noticias-menores-container');

    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (!response.ok) {
            throw new Error("Erro ao carregar as notícias.");
        }
        const posts = await response.json();

        if (posts.length === 0) {
            destaquePrincipalContainer.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
            destaqueSecundarioContainer.innerHTML = '';
            noticiasMenoresContainer.innerHTML = '';
            return;
        }

        // Limpa os placeholders
        destaquePrincipalContainer.innerHTML = '';
        destaqueSecundarioContainer.innerHTML = '';
        noticiasMenoresContainer.innerHTML = '';

        // Exibe a primeira notícia como destaque principal
        const primeiroPost = posts[0];
        // Usa o texto do post, ou o Lorem Ipsum se estiver vazio
        const textoPrincipal = primeiroPost.content && primeiroPost.content.trim() !== '' ? primeiroPost.content : loremIpsumText;
        
        destaquePrincipalContainer.innerHTML = `
            <article class="destaque-principal noticia-destaque" onclick="window.location.href='../PaginaNoticia/paginaNoticia.html?id=${primeiroPost.id}'">
                ${primeiroPost.imageUrl ? `<img src="${primeiroPost.imageUrl}" alt="${primeiroPost.title}">` : ''}
                <div class="noticia-overlay">
                    <span class="categoria">${primeiroPost.category || 'GERAL'}</span>
                    <h2>${primeiroPost.title}</h2>
                    <p class="resumo">${textoPrincipal.substring(0, 100)}...</p>
                    <p class="data">${new Date(primeiroPost.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
            </article>
        `;

        // Exibe a segunda notícia como destaque secundário
        if (posts.length > 1) {
            const segundoPost = posts[1];
            // Usa o texto do post, ou o Lorem Ipsum se estiver vazio
            const textoSecundario = segundoPost.content && segundoPost.content.trim() !== '' ? segundoPost.content : loremIpsumText;
            
            destaqueSecundarioContainer.innerHTML = `
                <article class="destaque-secundario noticia-destaque" onclick="window.location.href='../PaginaNoticia/paginaNoticia.html?id=${segundoPost.id}'">
                    ${segundoPost.imageUrl ? `<img src="${segundoPost.imageUrl}" alt="${segundoPost.title}">` : ''}
                    <div class="noticia-overlay">
                        <span class="categoria">${segundoPost.category || 'GERAL'}</span>
                        <h2>${segundoPost.title}</h2>
                        <p class="resumo">${textoSecundario.substring(0, 80)}...</p>
                        <p class="data">${new Date(segundoPost.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                </article>
            `;
        }
        
        // Exibe as demais notícias na seção de notícias menores
        if (posts.length > 2) {
            posts.slice(2).forEach(post => {
                const article = document.createElement('article');
                article.classList.add('noticia-menor');
                article.onclick = () => window.location.href = `../PaginaNoticia/paginaNoticia.html?id=${post.id}`;
                
                // Usa o texto do post, ou o Lorem Ipsum se estiver vazio
                const textoMenor = post.text && post.text.trim() !== '' ? post.text : loremIpsumText;
                
                article.innerHTML = `
                    ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}">` : ''}
                    <div class="noticia-menor-content">
                        <span class="categoria">${post.category || 'GERAL'}</span>
                        <h3>${post.title}</h3>
                        <p class="data">${new Date(post.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                `;
                noticiasMenoresContainer.appendChild(article);
            });
        }

    } catch (error) {
        console.error("Erro ao carregar notícias:", error);
        destaquePrincipalContainer.innerHTML = '<p>Erro ao carregar notícias. Tente novamente mais tarde.</p>';
        destaqueSecundarioContainer.innerHTML = '';
        noticiasMenoresContainer.innerHTML = '';
    }
});