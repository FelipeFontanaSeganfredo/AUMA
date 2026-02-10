document.addEventListener("DOMContentLoaded", () => {
    // ⚙️ Configurações
    const API_BASE_URL = 'https://auma-api-9w04.onrender.com';

    // Funções Auxiliares de Autenticação
    function getToken() {
        return localStorage.getItem('jwtToken');
    }

    function getUserEmail() {
        return localStorage.getItem('userEmail');
    }

    function isAuthenticated() {
        return !!getToken();
    }

    function logout() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }

    // Se o usuário não estiver autenticado, redireciona para a página de login
    if (!isAuthenticated()) {
        alert('Você precisa estar logado para cadastrar uma notícia.');
        return;
    }

    // 🌐 Elementos do DOM
    const newsGrid = document.getElementById("news-grid");
    const modal = document.getElementById("edit-modal");
    const closeModalBtn = document.getElementById("close-modal");
    const editForm = document.getElementById("edit-form");
    const saveBtn = document.getElementById("save-btn");
    const deleteBtn = document.getElementById("delete-btn");

    let currentNewsId = null;

    // 📡 1. Buscar Notícias (GET)
    async function fetchNews() {
        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                    // Nota: Se o GET /posts for público no SecurityConfig, não precisa de token.
                    // Se for privado, descomente a linha abaixo:
                    // 'Authorization': `Bearer ${getToken()}`
                }
            });

            if (response.ok) {
                return await response.json();
            } else {
                console.error('Erro ao buscar notícias:', response.status);
                return [];
            }
        } catch (error) {
            console.error('Erro de rede ao buscar notícias:', error);
            alert('Não foi possível conectar ao servidor.');
            return [];
        }
    }

    // 🖼️ 2. Renderizar Notícias na Tela
    function renderNews(newsList) {
        newsGrid.innerHTML = '';

        if (!newsList || newsList.length === 0) {
            newsGrid.innerHTML = '<p style="color:white; text-align:center;">Nenhuma notícia encontrada.</p>';
            return;
        }

        newsList.forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            
            // Ajuste para ID: backend envia "id", mas alguns bancos usam "_id"
            const newsId = news.id || news._id; 
            newsItem.dataset.id = newsId;

            // Evento de clique para abrir modal
            newsItem.addEventListener('click', (e) => {
                e.preventDefault();
                openEditModal(news);
            });

            // Fallback de imagem caso venha nula
            const imgSrc = news.imageUrl ? news.imageUrl : '../Assets/auma-logo.png';

            newsItem.innerHTML = `
                <a href="#" data-id="${newsId}">
                    <img src="${imgSrc}" alt="${news.title || 'Notícia'}" style="object-fit: cover;">
                    <p style="color:white; text-align:center; margin-top:10px;">${news.title}</p>
                </a>
            `;
            newsGrid.appendChild(newsItem);
        });
    }

    // 📝 3. Abrir Modal de Edição
    function openEditModal(news) {
        currentNewsId = news.id || news._id;

        // Preenche o formulário com os dados atuais
        document.getElementById("edit-title").value = news.title || '';
        // O backend mapeia "text" para "content" no DTO de resposta? 
        // Verifique se o objeto 'news' tem a propriedade .text ou .content
        document.getElementById("edit-text").value = news.text || news.content || ''; 
        
        // Limpa o input de arquivo (não é possível pré-carregar arquivos por segurança)
        document.getElementById("edit-image").value = '';

        if (currentNewsId) {
             modal.style.display = "flex";
        } else {
             alert('Erro: ID da notícia inválido.');
        }
    }

    // ❌ 4. Fechar Modal
    function closeEditModal() {
        modal.style.display = "none";
        currentNewsId = null;
        editForm.reset();
    }

    // 💾 5. SALVAR EDIÇÃO (PUT) - CORRIGIDO
    saveBtn.addEventListener('click', async () => {
        if (!currentNewsId) {
            alert('Nenhuma notícia selecionada.');
            return;
        }

        const token = getToken();
        if (!token) {
            alert('Sessão expirada. Faça login novamente.');
            return;
        }

        // Coleta dados do formulário
        const title = document.getElementById('edit-title').value;
        const textValue = document.getElementById('edit-text').value;
        const imageFile = document.getElementById('edit-image').files[0];

        // ⚠️ CRIAÇÃO DO FORMDATA (Obrigatório para o backend Java)
        // O PostController espera @RequestParam, que funciona com FormData simples.
        const formData = new FormData();
        
        formData.append('title', title);
        formData.append('text', textValue);

        // Só anexa a imagem se o usuário tiver selecionado uma nova
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/posts/${currentNewsId}`, {
                method: 'PUT',
                headers: {
                    // Autenticação Bearer
                    'Authorization': `Bearer ${token}`
                    // IMPORTANTE: NÃO definir 'Content-Type'. 
                    // O navegador define automaticamente multipart/form-data com boundary.
                },
                body: formData
            });

            if (response.ok) {
                alert('Notícia atualizada com sucesso!');
                closeEditModal();
                loadAndRenderNews(); // Recarrega a lista
            } else {
                const errorText = await response.text();
                console.error('Erro backend:', errorText);
                
                if (response.status === 401) {
                    alert("Erro 401: Não autorizado. Seu token pode ter expirado ou o servidor reiniciou. Faça login novamente.");
                } else {
                    alert(`Falha ao atualizar (Erro ${response.status}): ${errorText}`);
                }
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Erro de conexão ao tentar salvar.');
        }
    });

    // 🗑️ 6. EXCLUIR NOTÍCIA (DELETE)
    deleteBtn.addEventListener('click', async () => {
        if (!currentNewsId) {
            alert('Nenhuma notícia selecionada.');
            return;
        }

        if (!confirm('Tem certeza que deseja excluir esta notícia? Esta ação é irreversível.')) {
            return;
        }

        const token = getToken();

        try {
            const response = await fetch(`${API_BASE_URL}/posts/${currentNewsId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Para DELETE sem corpo, geralmente não precisa de Content-Type,
                    // mas se o backend esperar JSON em algum retorno, mal não faz.
                    'Content-Type': 'application/json' 
                }
            });

            if (response.ok) {
                alert('Notícia excluída com sucesso!');
                closeEditModal();
                loadAndRenderNews();
            } else {
                const errorText = await response.text();
                alert(`Erro ao excluir: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Não foi possível conectar ao servidor.');
        }
    });

    // 🔄 Inicialização
    async function loadAndRenderNews() {
        newsGrid.innerHTML = '<p style="color:white; text-align:center;">Carregando notícias...</p>';
        const newsList = await fetchNews();
        renderNews(newsList);
    }

    // Carrega as notícias ao abrir a página
    loadAndRenderNews();

    // Eventos de Fechamento do Modal
    closeModalBtn.addEventListener("click", closeEditModal);
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeEditModal();
        }
    });
});