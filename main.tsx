import '../assets/css/style.css';

// Simple DOM manipulation to initialize the portfolio
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio loaded');
  
  // Initialize any interactive elements
  const revealElements = document.querySelectorAll('[data-reveal]');
  revealElements.forEach(el => {
    el.classList.add('revealed');
  });
});