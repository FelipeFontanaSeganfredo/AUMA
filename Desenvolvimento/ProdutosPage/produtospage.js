document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://auma-api-9w04.onrender.com';
    const productsContainer = document.getElementById('products-container');

    async function loadProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products?page=0&size=8`);
            if (!response.ok) throw new Error("Erro ao carregar produtos");
            
            const data = await response.json();
            const products = (data.content || []).slice(0, 8);

            if (products.length === 0) {
                productsContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
                return;
            }

            productsContainer.innerHTML = "";
            products.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('product-card');
                card.onclick = () => window.location.href = `produto.html?id=${product.id}`;
                card.innerHTML = `
                    ${product.imageUrl ? 
                        `<img src="${product.imageUrl}" alt="${product.name}">` : 
                        '<div style="height:200px;background:#E0E0E0;border-radius:10px;"></div>'
                    }
                    <h3>${product.name || 'Produto'}</h3>
                    <p class="category">${product.category} | ${product.dimension}</p>
                    <p class="gender">${product.gender || 'Unissex'}</p>
                    <button class="product-button">Ver Detalhes</button>
                `;
                productsContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            productsContainer.innerHTML = `
                <p>Erro ao carregar produtos.</p>
                <p>${error.message}</p>
            `;
        }
    }

    // ✅ Filtros melhorados
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');
    
    if (searchInput) searchInput.addEventListener('input', loadProducts);
    if (filterSelect) filterSelect.addEventListener('change', loadProducts);

    await loadProducts();
});
