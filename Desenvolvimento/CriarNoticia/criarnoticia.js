document.addEventListener('DOMContentLoaded', () => {
    // Definindo a URL base da API
    const API_BASE_URL = 'https://auma-api.onrender.com';

    // Funções para autenticação e token
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

    // Obtém o formulário e adiciona o evento de submissão
    const postForm = document.getElementById('post-form');
    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const token = getToken();
        const title = document.getElementById('title').value;
        const text = document.getElementById('text').value;
        const imageFile = document.getElementById('image').files[0];
        const userEmail = getUserEmail();

        // Cria um objeto FormData para enviar os dados, incluindo a imagem
        const formData = new FormData();
        formData.append('title', title);
        formData.append('text', text);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        formData.append('userEmail', userEmail);

        try {
            // Faz a requisição POST para o endpoint /posts
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                // O header Authorization é crucial para a autenticação
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                alert('Notícia criada com sucesso!');
                postForm.reset(); // Limpa o formulário
                // Opcionalmente, redirecionar para a página inicial ou de notícias
                // window.location.href = 'index.html'; 
            } else {
                // Se a resposta não for OK, tenta pegar o erro do servidor
                const errorData = await response.json();
                alert(`Erro ao criar notícia: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        }
    });
});