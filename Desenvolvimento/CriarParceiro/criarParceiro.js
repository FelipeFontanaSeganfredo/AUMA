document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'https://auma-api.onrender.com';
    const postForm = document.getElementById('post-form');

    // Verifica se tem token ao carregar a página
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert('Você precisa fazer login primeiro!');
        window.location.href = '../Login/login.html';
        return;
    }

    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Pega o token atualizado (caso tenha mudado em outra aba)
        const currentToken = localStorage.getItem('jwtToken');

        const formData = new FormData();

        const partnerDto = {
            name: document.getElementById('name').value,
            description: "Parceiro AUMA", // Valor padrão para passar na validação @NotBlank do DTO
            partnerUrl: document.getElementById('link').value,
            imageUrl: "" // Pode ir vazio agora que removemos @NotBlank do DTO, ou string vazia
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
                    // Não defina Content-Type aqui, o browser define automático para multipart
                },
                body: formData
            });

            if (response.status === 401) {
                alert("Sessão expirada. Por favor, faça login novamente.");
                window.location.href = '../Login/login.html';
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error("ERRO:", errorText);
                alert("Erro ao criar parceiro. Verifique o console.");
                throw new Error("Erro ao criar parceiro");
            }

            const result = await response.json();
            console.log("Parceiro criado:", result);
            alert("Parceiro criado com sucesso!");
            postForm.reset();

        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    });
});