document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://auma-api-9w04.onrender.com';
    
    // Elementos do DOM
    const destaqueContainer = document.getElementById('destaque-container');
    const noticiasMenoresContainer = document.getElementById('noticias-menores-container');
    const paginationContainer = document.getElementById('pagination-container');

    // Configuração
    let currentPage = 0;
    const itemsPerPage = 10; // Sempre busca 10 para manter consistência na API

    // Função Principal de Carga
    async function loadNews(page = 0) {
        try {
            // Efeito visual de recarregamento
            if(page !== 0) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                noticiasMenoresContainer.style.opacity = '0.5';
            }

            const response = await fetch(`${API_BASE_URL}/posts?page=${page}&size=${itemsPerPage}`);
            if (!response.ok) throw new Error("Erro ao carregar notícias.");

            const data = await response.json();
            const posts = data.content || [];
            const totalPages = data.totalPages || 0;

            renderNewsLayout(posts, page);
            renderPagination(totalPages, page);
            
            noticiasMenoresContainer.style.opacity = '1';
            currentPage = page;

        } catch (error) {
            console.error("Erro:", error);
            destaqueContainer.innerHTML = `<p style="text-align:center;">Erro ao carregar notícias: ${error.message}</p>`;
            noticiasMenoresContainer.innerHTML = '';
        }
    }

    // Lógica de Exibição (Layout diferente para página 0 vs outras)
    function renderNewsLayout(posts, page) {
        // Limpa containers
        destaqueContainer.innerHTML = '';
        noticiasMenoresContainer.innerHTML = '';

        if (posts.length === 0) {
            destaqueContainer.style.display = 'none';
            noticiasMenoresContainer.innerHTML = '<p style="text-align:center; width:100%;">Nenhuma notícia encontrada.</p>';
            return;
        }

        // --- LÓGICA DA PÁGINA 1 (Destaques + Lista) ---
        if (page === 0) {
            destaqueContainer.style.display = 'flex'; // Garante que destaques apareçam

            // Post 0 e 1 vão para o Destaque
            if (posts.length > 0) {
                destaqueContainer.innerHTML += createHighlightCard(posts[0], 'destaque-principal');
            }
            if (posts.length > 1) {
                destaqueContainer.innerHTML += createHighlightCard(posts[1], 'destaque-secundario');
            }

            // Post 2 em diante vão para a Lista
            const listaPosts = posts.slice(2);
            renderList(listaPosts);
        } 
        
        // --- LÓGICA DAS OUTRAS PÁGINAS (Apenas Lista) ---
        else {
            destaqueContainer.style.display = 'none'; // Esconde área de destaque
            
            // TODOS os posts vão para a Lista
            renderList(posts);
        }
    }

    // Função auxiliar para renderizar a lista
    function renderList(listaPosts) {
        if (listaPosts.length === 0) return;

        listaPosts.forEach(post => {
            const card = document.createElement('article');
            card.className = 'noticia-menor';
            card.onclick = () => window.location.href = `../PaginaNoticia/paginaNoticia.html?id=${post.id}`;

            const imageUrl = post.imageUrl || '../Assets/imagemNoticia.png';
            const resumo = getResumo(post.content);
            const dataFormatada = new Date(post.created_at).toLocaleDateString('pt-BR');

            card.innerHTML = `
                <div class="noticia-menor-img-box">
                    <img src="${imageUrl}" alt="${post.title}" onerror="this.src='../Assets/auma-logo.png'">
                </div>
                <div class="noticia-menor-content">
                    <span class="categoria">NOTÍCIA</span>
                    <h3>${post.title}</h3>
                    <p class="resumo">${resumo}</p>
                    <p class="data">${dataFormatada}</p>
                </div>
            `;
            noticiasMenoresContainer.appendChild(card);
        });
    }

    // Cria card de destaque
    function createHighlightCard(post, className) {
        const imageUrl = post.imageUrl || '../Assets/imagemNoticia.png';
        const resumo = getResumo(post.content, 100);
        const dataFormatada = new Date(post.created_at).toLocaleDateString('pt-BR');

        return `
            <article class="${className} noticia-destaque" onclick="window.location.href='../PaginaNoticia/paginaNoticia.html?id=${post.id}'">
                <img src="${imageUrl}" alt="${post.title}" onerror="this.src='../Assets/auma-logo.png'">
                <div class="noticia-overlay">
                    <span class="categoria">DESTAQUE</span>
                    <h2>${post.title}</h2>
                    <p class="resumo">${resumo}</p>
                    <p class="data">${dataFormatada}</p>
                </div>
            </article>
        `;
    }

    // Limpa HTML e resume texto
    function getResumo(htmlContent, maxLength = 150) {
        if (!htmlContent) return '';
        const text = htmlContent.replace(/<[^>]*>?/gm, ''); 
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // --- Paginação ---
    function renderPagination(totalPages, page) {
        paginationContainer.innerHTML = "";
        if (totalPages <= 1) return;

        const prevBtn = createPageBtn("«", page > 0, () => loadNews(page - 1));
        paginationContainer.appendChild(prevBtn);

        let start = Math.max(0, page - 2);
        let end = Math.min(totalPages - 1, page + 2);

        if (start > 0) paginationContainer.appendChild(createPageBtn("1", true, () => loadNews(0)));
        if (start > 1) paginationContainer.appendChild(createSpan("..."));

        for (let i = start; i <= end; i++) {
            const btn = createPageBtn(i + 1, true, () => loadNews(i));
            if (i === page) btn.classList.add('active');
            paginationContainer.appendChild(btn);
        }

        if (end < totalPages - 1) {
            if (end < totalPages - 2) paginationContainer.appendChild(createSpan("..."));
            paginationContainer.appendChild(createPageBtn(totalPages, true, () => loadNews(totalPages - 1)));
        }

        const nextBtn = createPageBtn("»", page < totalPages - 1, () => loadNews(page + 1));
        paginationContainer.appendChild(nextBtn);
    }

    function createPageBtn(text, enabled, onClick) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.disabled = !enabled;
        if (enabled) btn.onclick = onClick;
        return btn;
    }

    function createSpan(text) {
        const span = document.createElement('span');
        span.innerText = text;
        span.style.padding = "8px";
        span.style.alignSelf = "center";
        return span;
    }

    // Inicialização
    await loadNews(0);
});