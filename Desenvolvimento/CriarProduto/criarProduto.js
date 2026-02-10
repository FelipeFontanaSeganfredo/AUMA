document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'https://auma-api-9w04.onrender.com';

    function getToken() { return localStorage.getItem('jwtToken'); }
    function getUserEmail() { return localStorage.getItem('userEmail'); }
    function isAuthenticated() { return !!getToken(); }

    if (!isAuthenticated()) {
        Swal.fire({
            icon: 'warning',
            title: 'Acesso Negado',
            text: 'Você precisa estar logado para cadastrar um produto.',
            confirmButtonText: 'Login'
        }).then(() => {
            window.location.href = '../Login/login.html';
        });
        return;
    }

    const productForm = document.getElementById('product-form');
    
    // Preview da imagem
    document.getElementById('image').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('image-preview');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" style="max-width:200px;max-height:200px;border-radius:8px;">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '';
        }
    });

    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const token = getToken();
        const userEmail = getUserEmail();
        
        if (!userEmail) {
            Swal.fire('Erro', 'Email do usuário não encontrado. Faça login novamente.', 'error');
            return;
        }

        const name = document.getElementById('name').value.trim();
        const dimension = document.getElementById('dimension').value;
        const category = document.getElementById('category').value.trim();
        const gender = document.getElementById('gender').value;  // ✅ NATURAL
        const description = document.getElementById('description').value.trim();
        const imageFile = document.getElementById('image').files[0];

        if (!name) { Swal.fire('Erro', 'Nome é obrigatório', 'error'); return; }
        if (!dimension) { Swal.fire('Erro', 'Dimensão é obrigatória', 'error'); return; }
        if (!category) { Swal.fire('Erro', 'Categoria é obrigatória', 'error'); return; }

        try {
            let imageBase64 = null;
            if (imageFile) {
                imageBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(imageFile);
                });
            }

            // ✅ SEM .toUpperCase() no gender!
            const productData = {
                name,
                dimension: dimension.toUpperCase(),
                category,
                gender: gender || 'UNISSEX',  // ✅ Backend converte para minúsculo
                description,
                imageBase64,
                userEmail
            };

            console.log('Enviando:', productData); // Para debug

            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Produto Criado!',
                    text: 'O produto foi cadastrado com sucesso.',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    productForm.reset();
                    document.getElementById('image-preview').innerHTML = '';
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Falha ao Criar',
                    text: errorData.message || 'Erro desconhecido'
                });
            }
        } catch (error) {
            console.error('Erro:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro de Conexão',
                text: 'Não foi possível conectar ao servidor.'
            });
        }
    });
});
