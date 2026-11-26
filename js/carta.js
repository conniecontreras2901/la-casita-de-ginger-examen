// La Carta · pestañas accesibles del menú Assan.
// JavaScript externo; eventos registrados exclusivamente con addEventListener.
document.addEventListener('DOMContentLoaded', () => {
  const tabs = Array.from(document.querySelectorAll('#carta-tablist [role="tab"]'));
  if (!tabs.length) return;

  function activateTab(tab, moveFocus = false) {
    tabs.forEach((current) => {
      const active = current === tab;
      const panel = document.getElementById(current.getAttribute('aria-controls'));
      current.classList.toggle('active', active);
      current.setAttribute('aria-selected', active ? 'true' : 'false');
      current.tabIndex = active ? 0 : -1;
      if (panel) {
        // Assan usa las clases de pestañas de Bootstrap: una hoja sin .active queda oculta.
        panel.classList.toggle('active', active);
        panel.classList.toggle('show', active);
        panel.hidden = !active;
      }
    });
    if (moveFocus) tab.focus();
  }

  activateTab(tabs.find(tab => tab.classList.contains('active')) || tabs[0]);

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      const key = event.key;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;
      event.preventDefault();
      const next = key === 'Home' ? 0 : key === 'End' ? tabs.length - 1
        : (index + (key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      activateTab(tabs[next], true);
    });
  });
});
