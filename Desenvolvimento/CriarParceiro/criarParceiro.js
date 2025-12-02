document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'https://auma-api.onrender.com';
    const postForm = document.getElementById('post-form');

    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('Você precisa fazer login primeiro!');
            return;
        }

        const formData = new FormData();

        const partnerDto = {
            name: document.getElementById('name').value,
            description: "",              
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
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("ERRO:", errorText);
                throw new Error("Erro ao criar parceiro");
            }

            const result = await response.json();
            console.log("Parceiro criado:", result);

        } catch (error) {
            console.error("Erro na requisição:", error);
        }

    });

});
