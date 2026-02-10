document.addEventListener('DOMContentLoaded', () => {
    // URL da API
    const API_URL = 'https://auma-api-9w04.onrender.com';
    const partnersGrid = document.getElementById('partners-grid');

    async function fetchPartners() {
        try {
            // Busca até 100 parceiros de uma vez (sem paginação visual)
            const response = await fetch(`${API_URL}/partners?page=0&size=100`);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const data = await response.json();
            // Garante que pega o array correto (algumas APIs devolvem content, outras array direto)
            const partnersList = data.content || data || [];

            renderPartners(partnersList);

        } catch (error) {
            console.error('Erro ao buscar parceiros:', error);
            partnersGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center;">
                    <p>Não foi possível carregar a lista de parceiros.</p>
                </div>`;
        }
    }

    function renderPartners(partners) {
        // Limpa o loading
        partnersGrid.innerHTML = '';

        if (partners.length === 0) {
            partnersGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Nenhum parceiro cadastrado ainda.</p>';
            return;
        }

        partners.forEach(partner => {
            // Define o link (se não tiver, usa #)
            const linkUrl = partner.partnerUrl ? partner.partnerUrl : '#';
            const cursorStyle = partner.partnerUrl ? 'cursor: pointer;' : 'cursor: default;';
            const imageUrl = partner.imageUrl || '../Assets/auma-logo.png'; // Fallback se não tiver imagem

            // Cria o elemento
            const partnerCard = document.createElement('a');
            partnerCard.className = 'partner-item';
            partnerCard.href = linkUrl;
            
            // Se tiver link, abre em nova aba. Se for #, não faz nada.
            if(partner.partnerUrl) {
                partnerCard.target = '_blank';
            } else {
                partnerCard.onclick = (e) => e.preventDefault();
            }

            // Estrutura do Cartão:
            // 1. Box branca da imagem (.partner-img-box)
            // 2. Nome do parceiro (.partner-name)
            partnerCard.innerHTML = `
                <div class="partner-img-box">
                    <img src="${imageUrl}" alt="${partner.name || 'Parceiro'}" onerror="this.src='../Assets/auma-logo.png'">
                </div>
                <h3 class="partner-name">${partner.name || 'Parceiro AUMA'}</h3>
            `;

            partnersGrid.appendChild(partnerCard);
        });
    }

    // Inicia a busca
    fetchPartners();
});