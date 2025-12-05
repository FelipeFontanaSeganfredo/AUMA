const API_URL = 'https://auma-api.onrender.com';
let currentSection = 'posts';
let currentPage = 0;
const pageSize = 10;
let userRole = localStorage.getItem('userRole') || 'ADMIN';
let currentUserEmail = localStorage.getItem('userEmail');

document.addEventListener('DOMContentLoaded', () => {
    // Verifica login
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '../Login/login.html';
        return;
    }

    // Verifica se é Super Admin para mostrar aba Usuários
    if (userRole === 'SUPER_ADMIN') {
        document.getElementById('menu-users').style.display = 'block';
    }

    // Carrega seção inicial
    loadSection('posts');
});

// --- NAVEGAÇÃO ENTRE ABAS ---
function loadSection(section) {
    currentSection = section;
    currentPage = 0; // Resetar página

    // Atualiza Menu Ativo
    document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
    document.getElementById(`menu-${section}`).classList.add('active');

    // Atualiza Título e Botão
    const titles = {
        'posts': 'Gerenciar Notícias',
        'products': 'Gerenciar Produtos',
        'partners': 'Gerenciar Parceiros',
        'users': 'Gerenciar Usuários'
    };
    
    // Texto do botão
    const btnTexts = {
        'posts': '+ Criar Notícia',
        'products': '+ Criar Produto',
        'partners': '+ Criar Parceiro',
        'users': '+ Criar Usuário'
    };

    document.getElementById('section-title').textContent = titles[section];
    document.getElementById('btn-create').textContent = btnTexts[section];

    fetchItems();
}

// --- BUSCAR DADOS (GET) ---
async function fetchItems() {
    const container = document.getElementById('list-container');
    container.innerHTML = '<p>Carregando...</p>';

    const token = localStorage.getItem('jwtToken');
    
    // Endpoint dinâmico baseado na seção
    let endpoint = `${API_URL}/${currentSection}?page=${currentPage}&size=${pageSize}`;
    
    try {
        const response = await fetch(endpoint, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Falha ao buscar dados');

        const data = await response.json();
        const items = data.content || data; // Adaptação para paginação do Spring Boot

        renderList(items);
        renderPagination(data.totalPages || 1);

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="color:red">Erro ao carregar dados. Tente novamente.</p>';
    }
}

// --- RENDERIZAR LISTA ---
function renderList(items) {
    const container = document.getElementById('list-container');
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = '<p>Nenhum item encontrado.</p>';
        return;
    }

    items.forEach(item => {
        // Se for a seção de usuários, não mostrar o próprio usuário logado
        if (currentSection === 'users' && item.email === currentUserEmail) return;

        const card = document.createElement('div');
        card.className = 'admin-card';
        
        // Define imagem e título baseados no tipo de item
        let imgUrl = item.imageUrl || '../Assets/auma-logo.png';
        let title = item.title || item.name || item.email; // Fallback para diferentes estruturas
        let id = item.id;

        card.innerHTML = `
            <img src="${imgUrl}" alt="Imagem" onerror="this.src='../Assets/auma-logo.png'">
            <h4>${title}</h4>
            <div class="card-actions">
                <button class="btn-edit" onclick="handleEdit('${id}')">Editar</button>
                <button class="btn-delete" onclick="handleDelete('${id}')">Excluir</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- PAGINAÇÃO ---
function renderPagination(totalPages) {
    const controls = document.getElementById('pagination-controls');
    controls.innerHTML = '';

    if (totalPages <= 1) return;

    const prev = document.createElement('button');
    prev.textContent = 'Anterior';
    prev.disabled = currentPage === 0;
    prev.onclick = () => { if(currentPage > 0) { currentPage--; fetchItems(); }};
    
    const next = document.createElement('button');
    next.textContent = 'Próxima';
    next.disabled = currentPage >= totalPages - 1;
    next.onclick = () => { if(currentPage < totalPages -1) { currentPage++; fetchItems(); }};

    controls.appendChild(prev);
    controls.span = document.createElement('span');
    controls.span.textContent = ` Pág ${currentPage + 1} de ${totalPages} `;
    controls.appendChild(controls.span);
    controls.appendChild(next);
}

// --- AÇÕES DO BOTÃO CRIAR ---
function handleCreate() {
    // Redireciona para as páginas existentes (como solicitado) ou abre Modal
    if (currentSection === 'posts') window.location.href = '../CriarNoticia/criarnoticia.html';
    else if (currentSection === 'products') window.location.href = '../CriarProduto/criarproduto.html';
    else if (currentSection === 'partners') window.location.href = '../CriarParceiro/criarparceiro.html';
    else if (currentSection === 'users') {
        // Usuários geralmente cria via Modal simples pois não tem página dedicada
        Swal.fire('Funcionalidade', 'Redirecionar para criar usuário ou abrir modal aqui.', 'info');
    }
}

// --- AÇÃO DE EDITAR ---
function handleEdit(id) {
    // Salva o ID no localStorage para a página de edição recuperar
    localStorage.setItem('editItemId', id);

    if (currentSection === 'posts') window.location.href = '../EditarNoticia/editarNoticia.html'; // Adaptar editarNoticia para ler o ID do localStorage ou URL
    else if (currentSection === 'products') window.location.href = '../EditarProduto/editarProduto.html';
    else if (currentSection === 'partners') window.location.href = '../EditarParceiro/editarParceiro.html';
    else if (currentSection === 'users') Swal.fire('Editar Usuário', `ID: ${id}`, 'info');
}

// --- AÇÃO DE EXCLUIR ---
async function handleDelete(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: "Você não poderá reverter isso!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!'
    });

    if (result.isConfirmed) {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`${API_URL}/${currentSection}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                Swal.fire('Excluído!', 'O item foi excluído.', 'success');
                fetchItems(); // Recarrega a lista
            } else {
                Swal.fire('Erro', 'Não foi possível excluir.', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Erro', 'Erro de conexão.', 'error');
        }
    }
}