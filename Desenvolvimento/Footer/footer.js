function loadFooter() {
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = '../Footer/styleFooter.css';
    document.head.appendChild(cssLink);

    fetch('../Footer/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o footer');
            }
            return response.text();
        })
        .then(data => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = data;
            
                const fontLink = document.createElement('link');
                fontLink.rel = 'stylesheet';
                fontLink.href = 'https://fonts.googleapis.com/css2?family=Nova+Square&display=swap';
                document.head.appendChild(fontLink);
            }
        })
        .catch(error => console.error('Error loading footer:', error));
}

document.addEventListener('DOMContentLoaded', loadFooter);