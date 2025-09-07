document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');
    const createNewsButton = document.getElementById('create-news-button');

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

    function getToken() {
        return localStorage.getItem('jwtToken');
    }

    const token = getToken();

    if (!token) {
     window.location.href = '../Login/login.html';
    }
});