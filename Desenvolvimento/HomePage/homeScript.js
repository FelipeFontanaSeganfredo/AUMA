document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os elementos com a classe "typewriter"
    const typewriters = document.querySelectorAll('.typewriter');
    
    // Armazena o texto original em um data-attribute e limpa o conteúdo
    typewriters.forEach(el => {
        el.setAttribute('data-text', el.textContent.replace(/\s+/g, ' ').trim());
        el.textContent = "";
    });
    
    // Função que realiza o efeito de digitação em um elemento
    function typeWriter(el) {
        const originalText = el.getAttribute('data-text');
        let index = 0;
        const delay = 75; // Ajuste o delay conforme necessário (em milissegundos)
        
        function write() {
            if (index < originalText.length) {
                el.textContent += originalText.charAt(index);
                index++;
                setTimeout(write, delay);
            }
        }
        write();
    }
    
    // Anima o primeiro texto imediatamente
    if (typewriters[0]) {
        typeWriter(typewriters[0]);
    }
    
    // Para o segundo texto, use IntersectionObserver para animá-lo quando ele entrar na viewport
    if (typewriters[1]) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(typewriters[1]);
    }
});
