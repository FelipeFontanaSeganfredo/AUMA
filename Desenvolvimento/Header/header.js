// Header/header.js

function loadHeader() {
    // Caminho relativo para o arquivo header.html
    fetch('../Header/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o header');
            }
            return response.text();
        })
        .then(data => {
            // Insere o conteúdo carregado no container
            document.getElementById('header-container').innerHTML = data;
            
            // Inicializa a funcionalidade do menu
            var menuToggle = document.querySelector('.menu-toggle');
            var navMenu = document.querySelector('.nav-menu');
            var closeMenu = document.querySelector('.close-menu');
            
            menuToggle.addEventListener('click', function () {
                navMenu.style.left = '0';  // Abre o menu
            });
            
            closeMenu.addEventListener('click', function () {
                navMenu.style.left = '-100%';  // Fecha o menu
            });
        })
        .catch(error => console.error('Error loading header:', error));
}

// Carrega o header quando o DOM estiver totalmente carregado
document.addEventListener('DOMContentLoaded', loadHeader);
