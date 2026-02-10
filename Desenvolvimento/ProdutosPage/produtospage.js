document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://auma-api-9w04.onrender.com';
    const productsContainer = document.getElementById('products-container');
    const paginationContainer = document.getElementById('pagination-container');
    
    // Configurações
    let currentPage = 0;
    const itemsPerPage = 16; // 16 produtos por página (4 linhas x 4 colunas)

    // Função Principal de Carregamento
    async function loadProducts(page = 0) {
        try {
            // Loading state
            productsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">Carregando produtos...</p>';
            
            // Busca na API
            const response = await fetch(`${API_BASE_URL}/products?page=${page}&size=${itemsPerPage}`);
            
            if (!response.ok) throw new Error("Não foi possível conectar ao servidor.");
            
            const data = await response.json();
            const products = data.content || [];
            const totalPages = data.totalPages || 0;

            // Renderiza
            renderProducts(products);
            renderPagination(totalPages, page);
            
            currentPage = page; // Atualiza estado atual

        } catch (error) {
            console.error("Erro:", error);
            productsContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: #666;">
                    <p>Ocorreu um erro ao carregar os produtos.</p>
                    <small>${error.message}</small>
                </div>
            `;
            paginationContainer.innerHTML = ""; // Limpa paginação em caso de erro
        }
    }

    // Função para desenhar os cartões
    function renderProducts(products) {
        productsContainer.innerHTML = "";
        
        if (products.length === 0) {
            productsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Nenhum produto encontrado.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            
            // Clique no card redireciona
            card.onclick = (e) => {
                // Evita redirecionar se clicar em botões específicos dentro do card (futuro)
                window.location.href = `produto.html?id=${product.id}`;
            };
            
            // Imagem de placeholder caso não exista
            const imageUrl = product.imageUrl || '../Assets/auma-logo.png'; 
            const imageStyle = product.imageUrl ? '' : 'opacity: 0.3; padding: 40px;';

            card.innerHTML = `
                <div class="product-image-box">
                    <img src="${imageUrl}" alt="${product.name}" style="${imageStyle}">
                </div>
                
                <div class="product-info">
                    <h3>${product.name || 'Produto Sem Nome'}</h3>
                    <p class="category">${product.category || 'Geral'} | ${product.dimension || 'Único'}</p>
                    <p class="gender">${product.gender || 'Unissex'}</p>
                    <button class="product-button">Ver Detalhes</button>
                </div>
            `;
            productsContainer.appendChild(card);
        });
    }

    // Função para desenhar a paginação
    function renderPagination(totalPages, page) {
        paginationContainer.innerHTML = "";
        
        // Se houver apenas 1 página ou nenhuma, não mostra paginação
        if (totalPages <= 1) return;

        // --- Botão Anterior ---
        const prevBtn = createPaginationButton("«", page > 0, () => changePage(page - 1));
        paginationContainer.appendChild(prevBtn);

        // --- Números das Páginas ---
        // Lógica inteligente para não mostrar 100 botões se tiver muitas páginas
        // Mostra sempre a primeira, a última e as vizinhas da atual
        
        let startPage = Math.max(0, page - 2);
        let endPage = Math.min(totalPages - 1, page + 2);

        // Ajuste para mostrar sempre pelo menos 5 botões se possível
        if (endPage - startPage < 4) {
            if (startPage === 0) endPage = Math.min(totalPages - 1, 4);
            else if (endPage === totalPages - 1) startPage = Math.max(0, totalPages - 5);
        }

        if (startPage > 0) {
             paginationContainer.appendChild(createPaginationButton("1", true, () => changePage(0)));
             if (startPage > 1) paginationContainer.appendChild(createSpan("..."));
        }

        for (let i = startPage; i <= endPage; i++) {
            const btn = createPaginationButton(i + 1, true, () => changePage(i));
            if (i === page) btn.classList.add('active');
            paginationContainer.appendChild(btn);
        }

        if (endPage < totalPages - 1) {
            if (endPage < totalPages - 2) paginationContainer.appendChild(createSpan("..."));
            paginationContainer.appendChild(createPaginationButton(totalPages, true, () => changePage(totalPages - 1)));
        }

        // --- Botão Próximo ---
        const nextBtn = createPaginationButton("»", page < totalPages - 1, () => changePage(page + 1));
        paginationContainer.appendChild(nextBtn);
    }

    // Auxiliar: Cria botão de paginação
    function createPaginationButton(text, enabled, onClick) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.disabled = !enabled;
        if (enabled) {
            btn.onclick = onClick;
        }
        return btn;
    }

    // Auxiliar: Cria span para "..."
    function createSpan(text) {
        const span = document.createElement('span');
        span.innerText = text;
        span.style.padding = "8px";
        span.style.alignSelf = "center";
        return span;
    }

    // Muda a página e sobe para o topo
    function changePage(newPage) {
        loadProducts(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Filtro simples (recarrega página inicial)
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let timeout = null;
        searchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                // AVISO: A API atual precisa suportar filtro por nome para isto funcionar no backend.
                // Por enquanto recarrega a página 0.
                loadProducts(0); 
            }, 500); // Delay para não chamar a cada letra digitada
        });
    }

    // Inicialização
    await loadProducts(0);
});