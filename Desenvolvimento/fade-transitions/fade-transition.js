// fade-transition.js

// Aplica o efeito de fade-in quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("fade-in");
  });
  
  // Aplica o efeito de fade-out ao clicar em links
  const links = document.querySelectorAll("a[href]:not([target])");
  
  links.forEach(link => {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
  
      // Só continua se for link interno
      if (href && !href.startsWith("http") && !href.startsWith("#")) {
        e.preventDefault();
  
        // Inicia o fade-out
        document.body.classList.remove("fade-in");
        document.body.style.opacity = 0;
  
        // Espera o tempo da transição e muda de página
        setTimeout(() => {
          window.location.href = href;
        }, 400);
      }
    });
  });
  