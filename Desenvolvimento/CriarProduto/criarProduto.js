document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://auma-api.onrender.com';

    function getToken() { return localStorage.getItem('jwtToken'); }
    function getUserEmail() { return localStorage.getItem('userEmail'); }
    function isAuthenticated() { return !!getToken(); }

    // Verificação de autenticação
    if (!isAuthenticated()) {
        Swal.fire({
            icon: 'warning',
            title: 'Acesso Negado',
            text: 'Você precisa estar logado para cadastrar um produto.',
            confirmButtonText: 'Login'
        }).then(() => {
             // Ajuste o caminho se necessário
            window.location.href = '../Login/login.html';
        });
        return;
    }

    const postForm = document.getElementById('post-form');
    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const token = getToken();
        
        const name = document.getElementById('name').value;
        const dimension = document.querySelector('select[name="dimention"]').value;
        const category = document.getElementById('category').value;
        const gender = document.querySelector('select[name="gender"]').value;
        const description = document.getElementById('text').value;
        const imageFile = document.getElementById('image').files[0];
        const userEmail = getUserEmail();

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
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                // SUCESSO
                Swal.fire({
                    icon: 'success',
                    title: 'Produto Criado!',
                    text: 'O produto foi cadastrado com sucesso.',
                    showConfirmButton: false,
                    timer: 1500
                });
                postForm.reset();
            } else {
                // ERRO
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Falha ao Criar',
                    text: `Erro: ${errorData.message || response.statusText}`
                });
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro de Servidor',
                text: 'Não foi possível conectar ao servidor.'
            });
        }
    });
});