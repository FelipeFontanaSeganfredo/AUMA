document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.querySelector('.contact-section .carousel-wrapper');
    const dots = document.querySelectorAll('.contact-section .dot');
    const slides = document.querySelectorAll('.contact-section .carousel-slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let slideInterval;

    // Mede a altura do slide ativo e ajusta o contêiner
    function updateCarouselHeight() {
        if (slides[currentSlide]) {
            const activeSlideHeight = slides[currentSlide].offsetHeight;
            wrapper.style.height = `${activeSlideHeight}px`;
        }
    }

    // Função para ir para um slide específico
    function goToSlide(slideIndex) {
        wrapper.style.transform = `translateX(-${slideIndex * (100 / totalSlides)}%)`;

        dots.forEach(dot => dot.classList.remove('active'));
        dots[slideIndex].classList.add('active');

        currentSlide = slideIndex;

        // Chama a função de ajuste de altura toda vez que o slide muda
        updateCarouselHeight();
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.dataset.slide);
            goToSlide(slideIndex);
            resetInterval();
        });
    });

    function startSlideShow() {
        slideInterval = setInterval(() => {
            const nextSlide = (currentSlide + 1) % totalSlides;
            goToSlide(nextSlide);
        }, 5000);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startSlideShow();
    }
    
    // Garante que a altura seja calculada corretamente após o carregamento
    // completo da página (incluindo imagens) e ao redimensionar a janela.
    window.addEventListener('load', updateCarouselHeight);
    window.addEventListener('resize', updateCarouselHeight);

    // Inicia o carrossel
    startSlideShow();
    // Define a altura inicial
    updateCarouselHeight(); 
});