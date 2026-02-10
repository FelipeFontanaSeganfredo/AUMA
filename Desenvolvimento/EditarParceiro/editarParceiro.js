document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://auma-api-9w04.onrender.com';
    const partnerGrid = document.getElementById('partner-grid');
    const modal = document.getElementById('edit-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const editForm = document.getElementById('edit-form');
    const saveBtn = document.getElementById('save-btn');
    const deleteBtn = document.getElementById('delete-btn');

    let currentPartnerId = null;

    // Verifica autenticação
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert('Você precisa fazer login primeiro!');
        window.location.href = '../Login/login.html';
        return;
    }

    // Carrega parceiros ao iniciar
    loadPartners();

    // Função para carregar parceiros da API
    async function loadPartners() {
        try {
            const response = await fetch(`${API_URL}/partners?page=0&size=100`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                alert('Sessão expirada. Por favor, faça login novamente.');
                window.location.href = '../Login/login.html';
                return;
            }

            if (!response.ok) {
                throw new Error('Erro ao carregar parceiros');
            }

            const data = await response.json();
            // Pega o conteúdo da página ou array direto
            const partnersList = data.content || data || [];
            displayPartners(partnersList);

        } catch (error) {
            console.error('Erro ao carregar parceiros:', error);
            alert('Erro ao carregar parceiros. Verifique o console.');
        }
    }

    // Exibe parceiros na grid
    function displayPartners(partners) {
        partnerGrid.innerHTML = '';

        if (partners.length === 0) {
            partnerGrid.innerHTML = '<p style="color: #666; text-align: center; grid-column: 1/-1;">Nenhum parceiro cadastrado ainda.</p>';
            return;
        }

        partners.forEach(partner => {
            const partnerItem = document.createElement('div');
            partnerItem.className = 'partner-item';
            partnerItem.dataset.id = partner.id;

            partnerItem.innerHTML = `
                <a href="#" class="partner-link">
                    <img src="${partner.imageUrl || '../Assets/auma-logo.png'}" alt="${partner.name}">
                    <p style="color:white; text-align:center; margin-top:10px;">${partner.name}</p>
                </a>
            `;

            // Adiciona evento de clique para abrir modal
            partnerItem.addEventListener('click', (e) => {
                e.preventDefault();
                openEditModal(partner);
            });

            partnerGrid.appendChild(partnerItem);
        });
    }

    // Abre modal com dados do parceiro
    function openEditModal(partner) {
        currentPartnerId = partner.id;
        
        document.getElementById('edit-title').value = partner.name;
        document.getElementById('edit-link').value = partner.partnerUrl || '';
        
        // Limpa o input de arquivo
        document.getElementById('edit-image').value = '';
        
        modal.style.display = 'flex';
    }

    // Fecha modal
    function closeModal() {
        modal.style.display = 'none';
        currentPartnerId = null;
        editForm.reset();
    }

    closeModalBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Salvar edição
    saveBtn.addEventListener('click', async () => {
        if (!currentPartnerId) return;

        // Pega o token atualizado (caso tenha mudado em outra aba)
        const currentToken = localStorage.getItem('jwtToken');
        
        if (!currentToken) {
            alert('Você precisa fazer login primeiro!');
            window.location.href = '../Login/login.html';
            return;
        }

        console.log('Token sendo usado:', currentToken );
        console.log('ID do parceiro:', currentPartnerId);

        const formData = new FormData();

        const partnerDto = {
            name: document.getElementById('edit-title').value,
            description: "Parceiro AUMA",
            partnerUrl: document.getElementById('edit-link').value,
            imageUrl: ""
        };

        console.log('Dados sendo enviados:', partnerDto);

        const jsonBlob = new Blob(
            [JSON.stringify(partnerDto)],
            { type: 'application/json' }
        );

        formData.append('request', jsonBlob);

        const fileInput = document.getElementById('edit-image');
        if (fileInput.files.length > 0) {
            formData.append('image', fileInput.files[0]);
            console.log('Imagem anexada:', fileInput.files[0].name);
        } else {
            console.log('Nenhuma imagem nova selecionada');
        }

        try {
            console.log('Enviando requisição PUT para:', `${API_URL}/partners/${currentPartnerId}`);
            
            const response = await fetch(`${API_URL}/partners/${currentPartnerId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${currentToken}`
                    // Não defina Content-Type aqui, o browser define automático para multipart
                },
                body: formData
            });
debugger
            console.log('Status da resposta:', response.status);

            if (response.status === 401) {
            alert('Sessão expirada. Por favor, faça login novamente.');
                window.location.href = '../Login/login.html';
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error('ERRO:', errorText);
            alert('Erro ao atualizar parceiro. Verifique o console.');
                throw new Error('Erro ao atualizar parceiro');
            }

            const result = await response.json();
            console.log('Parceiro atualizado:', result);
       alert('Parceiro atualizado com sucesso!');
            
          closeModal();
      loadPartners(); // Recarrega a lista

        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao atualizar parceiro. Detalhes no console.');
        }
    });

    // Excluir parceiro
    deleteBtn.addEventListener('click', async () => {
        if (!currentPartnerId) return;

        const confirmDelete = confirm('Tem certeza que deseja excluir este parceiro?');
        if (!confirmDelete) return;

        const currentToken = localStorage.getItem('jwtToken');
        console.log('puxou o tken>', currentToken);
        try {
            const response = await fetch(`${API_URL}/partners/${currentPartnerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${currentToken}`
                }
            });

            if (response.status === 401) {
                alert('Sessão expirada. Por favor, faça login novamente.');
                window.location.href = '../Login/login.html';
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error('ERRO:', errorText);
                alert('Erro ao excluir parceiro. Verifique o console.');
                throw new Error('Erro ao excluir parceiro');
            }

            alert('Parceiro excluído com sucesso!');
            closeModal();
            loadPartners(); // Recarrega a lista

        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    });

    // Funcionalidade para o menu colapsado
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const closeMenu = document.querySelector('.close-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.style.left = '0';
        });
    }

    if (closeMenu && navMenu) {
        closeMenu.addEventListener('click', function () {
            navMenu.style.left = '-100%';
        });
    }
});