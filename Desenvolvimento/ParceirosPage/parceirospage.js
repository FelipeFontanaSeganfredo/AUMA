document.addEventListener('DOMContentLoaded', () => {
    // URL da API local
    const API_URL = 'https://auma-api.onrender.com';
    const partnersGrid = document.querySelector('.partners-grid');

    async function fetchPartners() {
        try {
            // Busca os parceiros na API
            const response = await fetch(`${API_URL}/partners?page=0&size=100`);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const data = await response.json();
            // Pega o conteúdo da página ou array direto
            const partnersList = data.content || data || [];

            if (partnersList.length > 0) {
                renderPartners(partnersList);
            } else {
                partnersGrid.innerHTML = '<p style="text-align: center; width: 100%; grid-column: 1 / -1;">Nenhum parceiro cadastrado ainda.</p>';
            }

        } catch (error) {
            console.error('Erro ao buscar parceiros:', error);
            partnersGrid.innerHTML = '<p style="text-align: center; width: 100%; grid-column: 1 / -1; color: red;">Erro ao carregar parceiros.</p>';
        }
    }

    function renderPartners(partners) {
        // Limpa o conteúdo atual (o texto de "Carregando...")
        partnersGrid.innerHTML = '';

        partners.forEach(partner => {
            // 1. Cria a div do item
            const partnerItem = document.createElement('div');
            partnerItem.className = 'partner-item';

            // 2. Cria o link que envolve tudo
            const link = document.createElement('a');
            link.href = partner.partnerUrl ? partner.partnerUrl : '#'; 
            link.target = '_blank';
            // Remove a decoração de texto padrão do link para não sublinhar o nome
            link.style.textDecoration = 'none'; 
            
            // 3. Cria a imagem
            const img = document.createElement('img');
            img.src = partner.imageUrl; 
            img.alt = partner.name || 'Parceiro';
            // Estilo para garantir que a imagem não quebre o layout
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '8px';

            // Tratamento de erro da imagem
            img.onerror = function() {
                this.src = '../Assets/auma-logo.png'; 
            };

            // 4. CORREÇÃO: Cria o parágrafo para o NOME
            const nameParagraph = document.createElement('p');
            nameParagraph.textContent = partner.name;
            
            // Estilização do nome para aparecer igual ao mockup (branco e centralizado)
            nameParagraph.style.color = 'white';
            nameParagraph.style.textAlign = 'center';
            nameParagraph.style.marginTop = '10px';
            nameParagraph.style.fontSize = '1.1em';
            nameParagraph.style.fontWeight = 'bold';
            nameParagraph.style.fontFamily = "'Nova Square', sans-serif";

            // 5. Monta a estrutura: Link contém Imagem + Nome
            link.appendChild(img);
            link.appendChild(nameParagraph);
            
            // Adiciona o link ao card, e o card ao grid
            partnerItem.appendChild(link);
            partnersGrid.appendChild(partnerItem);
        });
    }

    // Inicia a busca
    fetchPartners();
});