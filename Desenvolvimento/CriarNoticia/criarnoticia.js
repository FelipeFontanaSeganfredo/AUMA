document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://auma-api-9w04.onrender.com';

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
                window.location.href = 'login.html'; 
            }
        });
        return;
    }

    const postForm = document.getElementById('post-form');
    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const token = getToken();
        const title = document.getElementById('title').value.trim();
        const text = document.getElementById('text').value.trim();
        const imageFile = document.getElementById('image').files[0];
        const userEmail = getUserEmail();

        // ✅ VALIDAÇÃO NO FRONTEND
        if (!title) {
            Swal.fire('Erro', 'Título é obrigatório!', 'error');
            return;
        }
        if (!text) {
            Swal.fire('Erro', 'Conteúdo é obrigatório!', 'error');
            return;
        }
        if (!userEmail) {
            Swal.fire('Erro', 'Faça login novamente!', 'error');
            logout();
            return;
        }

        try {
            // 🔄 CONVERTER IMAGEM PARA BASE64
            let imageBase64 = null;
            if (imageFile) {
                imageBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result); // data:image/jpeg;base64,...
                    reader.readAsDataURL(imageFile);
                });
            }

            // ✅ ENVIAR JSON (NÃO FormData!)
            const postData = {
                title,
                content: text,  // ← 'text' vira 'content'
                userEmail,
                imageBase64
            };

            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'  // ← JSON!
                },
                body: JSON.stringify(postData)  // ← JSON!
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: 'Notícia criada com sucesso!',
                    showConfirmButton: false,
                    timer: 1500
                });
                postForm.reset(); 
            } else {
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
