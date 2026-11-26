// Navegación móvil del template Assan adaptada con JavaScript externo.
// No modifica el libro, la carta ni el contenido de la EV2.
document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('[data-assan-toggle]');
  const menu = document.getElementById('navbarRestaurant');
  if (!button || !menu) return;
  const closeMenu = () => { menu.classList.remove('is-open'); button.setAttribute('aria-expanded','false'); };
  button.addEventListener('click', () => {
    const opening = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open',opening);
    button.setAttribute('aria-expanded',String(opening));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
});
