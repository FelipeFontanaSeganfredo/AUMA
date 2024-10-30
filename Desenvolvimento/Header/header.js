        // Funcionalidade para o menu colapsado
        document.addEventListener('DOMContentLoaded', function () {
            var menuToggle = document.querySelector('.menu-toggle');
            var navMenu = document.querySelector('.nav-menu');
            var closeMenu = document.querySelector('.close-menu');

            // Abre o menu ao clicar no ícone de hambúrguer
            menuToggle.addEventListener('click', function () {
                navMenu.style.left = '0';  // Desliza o menu para dentro da tela
            });

            // Fecha o menu ao clicar no ícone de fechar (×)
            closeMenu.addEventListener('click', function () {
                navMenu.style.left = '-100%';  // Desliza o menu para fora da tela
            });
        });