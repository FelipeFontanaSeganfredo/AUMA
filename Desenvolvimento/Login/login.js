document.addEventListener('DOMContentLoaded', () => {
    // Definindo a URL base da API
    const API_BASE_URL = 'https://auma-api.onrender.com';

    // Função para verificar se o usuário já está logado
    function checkAuthentication() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            // Se um token válido existir, redireciona para a página do painel
            // Você pode adicionar uma validação de token aqui se necessário
            window.location.href = '../AdminPage/paginaAdmin.html'; // Redireciona para a página do painel
        }
    }

    // Chama a função de verificação ao carregar a página
    checkAuthentication();

    // Obtém o formulário pelo ID
    const loginForm = document.getElementById('login-form');

    // Adiciona um listener para o evento de 'submit' do formulário
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário

        // Coleta os valores dos campos de e-mail e senha
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Faz a requisição POST para o endpoint de login
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            // Verifica se a resposta foi bem-sucedida
            if (response.ok) {
                const data = await response.json();

                // Armazena o token de acesso e o e-mail do usuário no localStorage
                localStorage.setItem('jwtToken', data.accessToken);
                localStorage.setItem('userEmail', email); 
                
                alert('Login bem-sucedido!');
                window.location.href = '../AdminPage/paginaAdmin.html'; // Redireciona para a página do painel
            } else {
                // Se a resposta não for OK, exibe um alerta de erro
                alert('Email ou senha incorretos.');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
        }
    });
});