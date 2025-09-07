document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://auma-api.onrender.com';
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // Se não houver ID na URL, exibe uma mensagem de erro ou redireciona
    if (!postId) {
        document.querySelector('.content').innerHTML = '<p>Erro: ID da notícia não fornecido.</p>';
        return;
    }

    // Selecionando os placeholders do HTML
    const postTitleElement = document.getElementById('post-title');
    const postDateElement = document.getElementById('post-date');
    const postImageContainer = document.getElementById('post-image-container');
    const postTextContainer = document.getElementById('post-text-container');
    const relatedPostsContainer = document.getElementById('related-posts-container');

    async function loadPost() {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
            if (!response.ok) {
                // Se a resposta não for OK, lança um erro com o status
                throw new Error(`Erro ao carregar a notícia. Status: ${response.status}`);
            }
            const post = await response.json();

            // Formata a data
            const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR');

            // Preenche os placeholders com os dados da API
            postTitleElement.textContent = post.title;
            postDateElement.textContent = `publicado em ${formattedDate}`;
            
            if (post.imageUrl) {
                postImageContainer.innerHTML = `<img src="${post.imageUrl}" alt="${post.title}">`;
            } else {
                postImageContainer.innerHTML = '';
            }

            // Para exibir o texto com parágrafos, a gente o divide por quebras de linha
            const textParagraphs = post.content.split('\n').map(p => `<p class="main-text">${p}</p>`).join('');
            postTextContainer.innerHTML = textParagraphs;

        } catch (error) {
            console.error("Erro ao carregar a notícia principal:", error);
            document.querySelector('.content').innerHTML = `
                <p>Não foi possível carregar o conteúdo desta notícia.</p>
                <p>Verifique se o ID está correto e tente novamente mais tarde.</p>
            `;
        }
    }

    async function loadRelated() {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}/related`);
            if (!response.ok) {
                throw new Error("Erro ao carregar posts relacionados");
            }
            const relatedPosts = await response.json();

            if (relatedPosts.length === 0) {
                relatedPostsContainer.innerHTML = "<p>Nenhum post recomendado.</p>";
                return;
            }

            relatedPostsContainer.innerHTML = ""; // Limpa o placeholder de carregamento
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
            console.error("Erro ao carregar posts recomendados:", error);
            relatedPostsContainer.innerHTML = `<p>Erro ao carregar recomendações.</p>`;
        }
    }

    await loadPost();
    await loadRelated();
});