document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://auma-api.onrender.com';
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
        const formData = new FormData();

        const partnerDto = {
            name: document.getElementById('name').value,
            description: "Parceiro AUMA",
            partnerUrl: document.getElementById('link').value,
            imageUrl: ""
        };

        const jsonBlob = new Blob(
            [JSON.stringify(partnerDto)],
            { type: 'application/json' }
        );

        formData.append('request', jsonBlob);

        const fileInput = document.getElementById('image');
        if (fileInput.files.length > 0) {
            formData.append('image', fileInput.files[0]);
        }

        try {
            const response = await fetch(`${API_URL}/partners`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentToken}`
                },
                body: formData
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
                const errorText = await response.text();
                console.error("ERRO:", errorText);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao criar parceiro. Verifique os dados.'
                });
                throw new Error("Erro ao criar parceiro");
            }

            const result = await response.json();
            console.log("Parceiro criado:", result);

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
            // O catch pode capturar o throw new Error acima, 
            // então verificamos se já exibimos um alert antes ou se é erro de rede
        }
    });
});