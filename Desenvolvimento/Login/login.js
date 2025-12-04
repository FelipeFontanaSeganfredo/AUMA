document.addEventListener('DOMContentLoaded', () => {
    // Definindo a URL base da API
    const API_URL = 'https://auma-api.onrender.com'; // <--- Você declarou como API_URL

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
            // CORREÇÃO: Usar API_URL ao invés de API_BASE_URL
            const response = await fetch(`${API_URL}/auth/login`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem('jwtToken', data.accessToken);
                localStorage.setItem('userEmail', email); 
                
                alert('Login bem-sucedido!');
                window.location.href = '../AdminPage/paginaAdmin.html';
            } else {
                alert('Email ou senha incorretos.');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        }
    });
});