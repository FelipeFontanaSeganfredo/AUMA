document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://auma-api-9w04.onrender.com';
    const postForm = document.getElementById('post-form');

    const token = localStorage.getItem('jwtToken');
    
    // Verificação inicial de Login
    if (!token) {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Você precisa fazer login primeiro!',
            confirmButtonText: 'Ir para Login'
        }).then(() => {
            window.location.href = '../Login/login.html';
        });
        return;
    }

    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const currentToken = localStorage.getItem('jwtToken');
        const name = document.getElementById('name').value.trim();
        const partnerUrl = document.getElementById('link').value.trim();
        const imageFile = document.getElementById('image').files[0];

        // ✅ VALIDAÇÕES
        if (!name) {
            Swal.fire('Erro', 'Nome do parceiro é obrigatório!', 'error');
            return;
        }
        if (!partnerUrl) {
            Swal.fire('Erro', 'URL do parceiro é obrigatória!', 'error');
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

            // ✅ ENVIAR JSON PURO (NÃO FormData!)
            const partnerData = {
                name,
                partnerUrl,
                imageBase64
            };

            const response = await fetch(`${API_URL}/partners`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${currentToken}`,
                    'Content-Type': 'application/json'  // ← JSON!
                },
                body: JSON.stringify(partnerData)  // ← JSON!
            });

            // Sessão Expirada (401)
            if (response.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Sessão Expirada',
                    text: 'Por favor, faça login novamente.',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    window.location.href = '../Login/login.html';
                });
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: errorData.message || 'Erro ao criar parceiro.'
                });
                return;
            }

            // SUCESSO
            Swal.fire({
                icon: 'success',
                title: 'Parceiro Criado!',
                showConfirmButton: false,
                timer: 1500
            });
            postForm.reset();

        } catch (error) {
            console.error("Erro na requisição:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erro de Conexão',
                text: 'Não foi possível conectar ao servidor.'
            });
        }
    });
});
