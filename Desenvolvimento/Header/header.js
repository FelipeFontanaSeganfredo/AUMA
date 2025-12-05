function loadHeader() {
    fetch('../Header/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            
            // Lógica do Menu Mobile
            var menuToggle = document.querySelector('.menu-toggle');
            var navMenu = document.querySelector('.nav-menu');
            var closeMenu = document.querySelector('.close-menu');
            
            if(menuToggle) menuToggle.addEventListener('click', () => navMenu.style.left = '0');
            if(closeMenu) closeMenu.addEventListener('click', () => navMenu.style.left = '-100%');

            // --- LÓGICA DO USUÁRIO LOGADO ---
            const token = localStorage.getItem('jwtToken');
            const userName = localStorage.getItem('userName') || 'Usuário';
            const desktopNav = document.querySelector('.desktop-nav ul');

            if (token && desktopNav) {
                // Remove botão de doar da lista para inserir o perfil antes (opcional) ou adiciona ao final
                
                const userLi = document.createElement('li');
                userLi.innerHTML = `
                    <div class="user-menu-container">
                        <button class="user-btn" onclick="toggleUserDropdown()">
                            <img src="../Assets/person-icon.png" style="width:20px;"> ${userName} ▼
                        </button>
                        <div id="userDropdown" class="dropdown-content">
                            <a href="#" onclick="openProfileModal()">Meu Perfil</a>
                            <a href="#" onclick="logoutUser()">Sair</a>
                        </div>
                    </div>
                `;
                desktopNav.appendChild(userLi);
            }
        })
        .catch(error => console.error('Error loading header:', error));
}

// Funções globais para o onclick funcionar
window.toggleUserDropdown = function() {
    document.getElementById("userDropdown").classList.toggle("show-dropdown");
}

// Fecha o dropdown se clicar fora
window.onclick = function(event) {
    if (!event.target.matches('.user-btn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show-dropdown')) {
                openDropdown.classList.remove('show-dropdown');
            }
        }
    }
}

window.logoutUser = function() {
    localStorage.clear();
    window.location.href = '../Login/login.html';
}

window.openProfileModal = function() {
    const userName = localStorage.getItem('userName') || '';
    const userEmail = localStorage.getItem('userEmail') || '';

    Swal.fire({
        title: 'Meu Perfil',
        html: `
            <input id="swal-input-name" class="swal2-input" placeholder="Nome" value="${userName}">
            <input id="swal-input-pass" type="password" class="swal2-input" placeholder="Nova Senha (opcional)">
            <p style="font-size:0.8em; color:gray; margin-top:10px;">Email: ${userEmail}</p>
        `,
        confirmButtonText: 'Salvar Alterações',
        showCancelButton: true,
        preConfirm: () => {
            const newName = document.getElementById('swal-input-name').value;
            const newPass = document.getElementById('swal-input-pass').value;
            // AQUI VOCÊ FARIA A REQUISIÇÃO PUT PARA O BACKEND PARA ATUALIZAR O USUÁRIO
            // Por enquanto, apenas simula atualização local
            localStorage.setItem('userName', newName);
            return { newName, newPass };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Sucesso', 'Perfil atualizado!', 'success').then(() => location.reload());
        }
    });
}

document.addEventListener('DOMContentLoaded', loadHeader);