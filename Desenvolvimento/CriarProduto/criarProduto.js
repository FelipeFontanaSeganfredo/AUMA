document.addEventListener('DOMContentLoaded', () => {
    // Definindo a URL base da API
    const API_BASE_URL = 'https://auma-api.onrender.com';

    // Funções para autenticação e token (reutilizadas)
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
        alert('Você precisa estar logado para cadastrar um produto.');
        // Considerar redirecionar para o login
        // window.location.href = '../Login/login.html'; 
        return;
    }

    // Obtém o formulário e adiciona o evento de submissão
    const postForm = document.getElementById('post-form');
    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const token = getToken();
        
        // Coleta os dados específicos do formulário de PRODUTO
        const name = document.getElementById('name').value;
        const dimension = document.querySelector('select[name="dimention"]').value;
        const category = document.getElementById('category').value; // ID que adicionaremos ao HTML
        const gender = document.querySelector('select[name="gender"]').value;
        const description = document.getElementById('text').value;
        const imageFile = document.getElementById('image').files[0];
        const userEmail = getUserEmail();

        // Cria um objeto FormData para enviar os dados
        const formData = new FormData();
        formData.append('name', name);
        formData.append('dimension', dimension);
        formData.append('category', category);
        formData.append('gender', gender);
        formData.append('description', description);
        formData.append('userEmail', userEmail);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            // Faz a requisição POST para o endpoint /products
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                alert('Produto criado com sucesso!');
                postForm.reset(); // Limpa o formulário
            } else {
                const errorData = await response.json();
                alert(`Erro ao criar produto: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        }
    });
});