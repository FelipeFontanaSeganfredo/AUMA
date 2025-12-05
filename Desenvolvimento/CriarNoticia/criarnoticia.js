document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://auma-api.onrender.com';

    function getToken() { return localStorage.getItem('jwtToken'); }
    function getUserEmail() { return localStorage.getItem('userEmail'); }
    function isAuthenticated() { return !!getToken(); }

    function logout() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }

    // Se o usuário não estiver autenticado
    if (!isAuthenticated()) {
        Swal.fire({
            icon: 'warning',
            title: 'Acesso Restrito',
            text: 'Você precisa estar logado para cadastrar uma notícia.',
            confirmButtonText: 'Ir para Login'
        }).then((result) => {
            if (result.isConfirmed) {
                // Ajuste o caminho se necessário (ex: '../Login/login.html')
                window.location.href = 'login.html'; 
            }
        });
        return;
    }

    const postForm = document.getElementById('post-form');
    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const token = getToken();
        const title = document.getElementById('title').value;
        const text = document.getElementById('text').value;
        const imageFile = document.getElementById('image').files[0];
        const userEmail = getUserEmail();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('text', text);
        if (imageFile) formData.append('image', imageFile);
        formData.append('userEmail', userEmail);

        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                // SUCESSO
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: 'Notícia criada com sucesso!',
                    showConfirmButton: false,
                    timer: 1500
                });
                postForm.reset(); 
            } else {
                // ERRO DA API
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: `Erro ao criar notícia: ${errorData.message || response.statusText}`
                });
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro de Conexão',
                text: 'Não foi possível conectar ao servidor.'
            });
        }
    });
});