document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://auma-api-9w04.onrender.com';

    function checkAuthentication() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            window.location.href = '../AdminPage/paginaAdmin.html';
        }
    }
    checkAuthentication();

    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();

                // SALVAR DADOS NO LOCALSTORAGE
                localStorage.setItem('jwtToken', data.accessToken);
                localStorage.setItem('userEmail', email);
                
                // Assumindo que o backend retorna o nome e a role. 
                // Se não retornar, salve um padrão ou decodifique o token depois.
                // Exemplo de salvamento seguro:
                localStorage.setItem('userName', data.name || email.split('@')[0]); 
                localStorage.setItem('userRole', data.role || 'ADMIN'); // 'ADMIN' ou 'SUPER_ADMIN'

                Swal.fire({
                    icon: 'success',
                    title: 'Login bem-sucedido!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = '../AdminPage/paginaAdmin.html';
                });

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Acesso Negado',
                    text: 'Email ou senha incorretos.'
                });
            }
        } catch (error) {
            console.error('Erro:', error);
            Swal.fire({ icon: 'warning', title: 'Erro de Conexão' });
        }
    });
});