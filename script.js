// Tally Form Configuration
// IMPORTANTE: Reemplaza 'XXXXXX' con tu ID real de Tally (ej: wM9kYp o similar)
const TALLY_FORM_ID = 'XXXXXX'; // ← Pega aquí tu ID de formulario Tally

// Función para abrir el modal con Tally Form
function openTallyModal() {
  const modal = document.getElementById('tallyModal');
  const formContainer = document.getElementById('tallyFormContainer');

  // Solo crear el iframe la primera vez
  if (!formContainer.innerHTML.trim()) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('data-tally-src', `https://tally.so/r/${TALLY_FORM_ID}`);
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.marginHeight = '0';
    iframe.marginWidth = '0';
    iframe.title = 'DeepWolf AI Consulting - Descubre tu Solución';
    // Atributos recomendados por Tally para mejor rendimiento
    iframe.allow = 'fullscreen';
    iframe.loading = 'lazy';

    formContainer.appendChild(iframe);

    // Cargar el script de Tally solo si no está ya
    if (!document.querySelector('script[src*="tally.so"]')) {
      const script = document.createElement('script');
      script.src = 'https://tally.so/widgets/embed.js';
      script.async = true;
      script.onload = () => {
        console.log('Tally embed script cargado');
      };
      script.onerror = () => {
        console.error('Error al cargar Tally embed script');
      };
      document.body.appendChild(script);
    }
  }

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';

  // Pequeño retraso para que el iframe se ajuste mejor (opcional pero ayuda)
  setTimeout(() => {
    if (window.Tally) {
      window.Tally.loadEmbeds();
    }
  }, 300);
}

// Función para cerrar el modal
function closeTallyModal() {
  const modal = document.getElementById('tallyModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
  const modal = document.getElementById('tallyModal');
  if (event.target === modal) {
    closeTallyModal();
  }
};

// Cerrar con tecla ESC
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' || event.key === 'Esc') {
    closeTallyModal();
  }
});

// FAQ Toggle (solo uno abierto a la vez)
function toggleFAQ(button) {
  const faqItem = button.parentElement;
  const wasActive = faqItem.classList.contains('active');

  // Cerrar todos
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });

  // Abrir el seleccionado si no estaba abierto
  if (!wasActive) {
    faqItem.classList.add('active');
  }
}

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Animación fade-in al hacer scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target); // opcional: observar solo una vez
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const elementsToAnimate = document.querySelectorAll(
    '.problem-item, .case-card, .diff-item, .faq-item, .solution-column, .deliverables'
  );

  elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });

  console.log('DeepWolf AI Consulting - Web cargada correctamente');
});
