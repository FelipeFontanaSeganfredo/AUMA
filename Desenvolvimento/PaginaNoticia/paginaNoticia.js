document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://auma-api-9w04.onrender.com';
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        document.querySelector('.content').innerHTML = '<p>Erro: ID da notícia não fornecido.</p>';
        return;
    }

    const postTitleElement = document.getElementById('post-title');
    const postDateElement = document.getElementById('post-date');
    const postImageContainer = document.getElementById('post-image-container');
    const postTextContainer = document.getElementById('post-text-container');
    const relatedPostsContainer = document.getElementById('related-posts-container');

    async function loadPost() {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}`); // ← AGORA EXISTE!
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            const post = await response.json();

            // ✅ CORRIGIDO: created_at → createdAt
            const formattedDate = new Date(post.created_at).toLocaleDateString('pt-BR');

            postTitleElement.textContent = post.title;
            postDateElement.textContent = `publicado em ${formattedDate}`;
            
            if (post.imageUrl) {
                postImageContainer.innerHTML = `<img src="${post.imageUrl}" alt="${post.title}">`;
            }

            // ✅ CORRIGIDO: content com parágrafos
            const textParagraphs = (post.content || '').split('\n')
                .map(p => `<p class="main-text">${p.trim()}</p>`)
                .filter(p => p.trim() !== '<p class="main-text"></p>')
                .join('');
            postTextContainer.innerHTML = textParagraphs || '<p>Conteúdo não disponível.</p>';

        } catch (error) {
            console.error("Erro ao carregar notícia:", error);
            document.querySelector('.content').innerHTML = `
                <p>Não foi possível carregar esta notícia (ID: ${postId}).</p>
                <p>${error.message}</p>
            `;
        }
    }

    async function loadRelated() {
        try {
            // ✅ Busca outros posts (exclui o atual)
            const response = await fetch(`${API_BASE_URL}/posts?page=0&size=3`);
            if (!response.ok) throw new Error("Erro ao carregar relacionados");
            
            const data = await response.json();
            const relatedPosts = (data.content || [])
                .filter(post => post.id != postId)
                .slice(0, 3);

            if (relatedPosts.length === 0) {
                relatedPostsContainer.innerHTML = "<p>Nenhum post relacionado.</p>";
                return;
            }

            relatedPostsContainer.innerHTML = "";
            relatedPosts.forEach(post => {
                const button = document.createElement('button');
                button.classList.add('related-news');
                button.onclick = () => window.location.href = `paginaNoticia.html?id=${post.id}`;
                button.innerHTML = `
                    ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}">` : ''}
                    <a>${post.title}</a>
                `;
                relatedPostsContainer.appendChild(button);
            });
        } catch (error) {
            console.error("Erro relacionados:", error);
            relatedPostsContainer.innerHTML = `<p>Erro ao carregar recomendações.</p>`;
        }
    }

    await Promise.all([loadPost(), loadRelated()]);
});
