document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');
    const createNewsButton = document.getElementById('create-news-button');
    const createProductButton = document.getElementById('create-product-button');
    const createPartnerButton = document.getElementById('create-partner-button');

    function logout() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userEmail');
        window.location.href = '../Login/login.html';
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // Adiciona o evento de clique ao botão de Criar Notícia
    if (createNewsButton) {
        createNewsButton.addEventListener('click', () => {
            // Redireciona o usuário para a página de criação de notícias
            window.location.href = '../CriarNoticia/criarnoticia.html'; 
        });
    }

    if (createProductButton) {
        createProductButton.addEventListener('click', () => {
            // Redireciona o usuário para a página de criação de produtos
            window.location.href = '../CriarProduto/criarproduto.html'; 
        });
    }

    if (createPartnerButton) {
        createPartnerButton.addEventListener('click', () => {
            // Redireciona o usuário para a página de criação de parceiros
            window.location.href = '../CriarParceiro/criarparceiro.html'; 
        });
    }

    function getToken() {
        return localStorage.getItem('jwtToken');
    }

    const token = getToken();
    
    if (!token) {
     window.location.href = '../Login/login.html';
    }

});