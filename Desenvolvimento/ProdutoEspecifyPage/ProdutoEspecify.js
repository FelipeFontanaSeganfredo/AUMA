// Dados simulados da sua API
const apiData = {
    "id": 28,
    "name": "abacate",
    "dimension": "M",
    "category": "Hortifruti", // Exemplo de categoria
    "gender": "feminino",
    "description": "Este é um abacate maduro e pronto para o consumo, rico em gorduras boas e perfeito para saladas ou guacamoles.",
    "image_url": null,
    "user_email": "admin@auma.com",
    "created_at": "2026-02-10T19:50:38.568Z"
};

function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function getProductByID(id) {
    const API_BASE_URL = 'https://auma-api-9w04.onrender.com';
    return fetch(`${API_BASE_URL}/products/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Produto não encontrado");
            }
            return response.json();
        });
}

async function renderProduct(data) {

    const productId = getProductIdFromURL();
    const response = await getProductByID(productId);
    console.log(response)

    document.getElementById('product-name').innerText = response.name;
    document.getElementById('product-desc').innerText = response.description;
    document.getElementById('product-dim').innerText = response.dimension;
    document.getElementById('product-gender').innerText = response.gender;
    document.getElementById('category-badge').innerText = response.category;
    document.getElementById('user-email').innerText = response.user_email;

    // Formatação de data
    const date = new Date(data.created_at);
    document.getElementById('created-at').innerText = date.toLocaleDateString('pt-BR');

    // Lógica de imagem (se for null, mantém o placeholder do seu sistema)
    if (response.image_url) {
        document.getElementById('img-render').src = response.image_url;
    } else {
        document.getElementById('img-render').src = '../Assets/auma-logo.png'; // Substitua pelo caminho do ícone de placeholder que você usa
    }
}

// Inicializa a renderização
window.onload = () => {
    renderProduct(apiData);
};