document.addEventListener('DOMContentLoaded', () => {
    // Definindo a URL base da API
    const API_URL = 'https://auma-api.onrender.com';

    // Função para verificar se o usuário já está logado
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

                localStorage.setItem('jwtToken', data.accessToken);
                localStorage.setItem('userEmail', email); 
                
                // --- SUCESSO ---
                Swal.fire({
                    icon: 'success',
                    title: 'Login bem-sucedido!',
                    text: 'Redirecionando...',
                    showConfirmButton: false,
                    timer: 1500 // Fecha automaticamente após 1.5 segundos
                }).then(() => {
                    // O redirecionamento acontece após o alerta fechar
                    window.location.href = '../AdminPage/paginaAdmin.html';
                });

            } else {
                // --- ERRO DE CREDENCIAIS ---
                Swal.fire({
                    icon: 'error',
                    title: 'Acesso Negado',
                    text: 'Email ou senha incorretos.',
                    confirmButtonColor: '#d33', // Opcional: cor vermelha no botão
                    confirmButtonText: 'Tentar novamente'
                });
            }
        } catch (error) {
            console.error('Erro no login:', error);
            
            // --- ERRO DE SERVIDOR/CONEXÃO ---
            Swal.fire({
                icon: 'warning',
                title: 'Erro de Conexão',
                text: 'Não foi possível conectar ao servidor. Verifique sua internet ou tente mais tarde.',
            });
        }
    });
});