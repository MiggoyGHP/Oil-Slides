/**
 * main.js - Reveal.js initialization and event wiring
 */

document.addEventListener('DOMContentLoaded', function() {
  Reveal.initialize({
    hash: true,
    slideNumber: true,
    progress: true,
    controls: true,
    keyboard: true,
    overview: true,
    center: false,
    transition: 'slide',
    transitionSpeed: 'default',
    backgroundTransition: 'fade',
    width: 1280,
    height: 720,
    margin: 0.04,
    minScale: 0.2,
    maxScale: 2.0,
    // Plugins
    plugins: [],
  });

  // Animate barrel bars when their slide becomes active
  Reveal.on('slidechanged', function(event) {
    const slide = event.currentSlide;
    // Trigger barrel bar animations
    slide.querySelectorAll('.barrel-bar').forEach(bar => {
      const target = bar.dataset.width;
      if (target) {
        bar.style.width = '0%';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            bar.style.width = target;
          });
        });
      }
    });

    // Close any open popups on slide change
    const popup = document.querySelector('.term-popup');
    if (popup) popup.remove();

    // Close chart modal on slide change
    const modal = document.querySelector('.chart-modal-overlay');
    if (modal) {
      modal.remove();
      Reveal.configure({ keyboard: true });
    }
  });

  // Enable scrolling on quiz slides by intercepting wheel events
  document.querySelector('.reveal').addEventListener('wheel', function(e) {
    const quizSlide = e.target.closest('.quiz-slide');
    if (quizSlide) {
      const atTop = quizSlide.scrollTop <= 0;
      const atBottom = quizSlide.scrollTop + quizSlide.clientHeight >= quizSlide.scrollHeight - 2;
      // Only let Reveal handle it if fully scrolled to boundary in that direction
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        return; // let Reveal navigate
      }
      e.stopPropagation(); // prevent Reveal from changing slides
    }
  }, true);

  // Agenda click navigation
  document.querySelectorAll('.agenda-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = parseInt(this.dataset.slide);
      if (!isNaN(target)) {
        Reveal.slide(target);
      }
    });
  });
});
