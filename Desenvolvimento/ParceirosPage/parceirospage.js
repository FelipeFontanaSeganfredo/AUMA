// parceirosPage.js - Script para integração com a API de parceiros

const API_URL = 'https://auma-api.onrender.com/partners';

// Função para buscar todos os parceiros da API
async function fetchPartners() {
    try {
        // Busca todos os parceiros (sem paginação limitada)
        const response = await fetch(`${API_URL}?page=0&size=100`);
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        
        // Sempre renderiza os parceiros (mesmo que seja vazio)
        renderPartners(data.content || []);

    } catch (error) {
        console.error('Erro ao buscar parceiros:', error);
        // Em caso de erro, limpa o grid (não mostra parceiros estáticos)
        renderPartners([]);
    }
}

// Função para renderizar os parceiros dinamicamente
function renderPartners(partners) {
    const partnersGrid = document.querySelector('.partners-grid');
    
    if (!partnersGrid) {
        console.error('Grid de parceiros não encontrado');
        return;
    }

    // SEMPRE limpa o conteúdo atual (remove os estáticos)
    partnersGrid.innerHTML = '';

    // Se não há parceiros, deixa vazio
    if (partners.length === 0) {
        console.log('Nenhum parceiro para exibir');
        return;
    }

    // Renderiza cada parceiro da API
    partners.forEach(partner => {
        const partnerItem = document.createElement('div');
        partnerItem.className = 'partner-item';

        const link = document.createElement('a');
        link.href = partner.partnerUrl || '#';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const img = document.createElement('img');
        img.src = partner.imageUrl;
        img.alt = partner.name || 'Logo do Parceiro';

        link.appendChild(img);
        partnerItem.appendChild(link);
        partnersGrid.appendChild(partnerItem);
    });
}

// Executa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    fetchPartners();
});