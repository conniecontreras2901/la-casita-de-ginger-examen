/* =====================================================================
   general.js · AUTORA: DANIELA GONZÁLEZ
   JavaScript que se usa en TODAS las páginas del sitio.

   Funcionalidades:
   1. Mostrar el botón "Volver arriba" (back-to-top del template)
      cuando la persona baja más de 400px.        → evento "scroll"
   2. Volver arriba con desplazamiento suave.     → evento "click"
   3. Marcar en el menú la página en la que está la persona.

   Contenidos de clase aplicados: archivo JS externo, DOMContentLoaded,
   getElementById, querySelectorAll, addEventListener, classList,
   condicionales (if/else), funciones y constantes.
   ===================================================================== */

// Se espera a que el HTML termine de cargar antes de buscar los elementos.
document.addEventListener('DOMContentLoaded', function () {

    /* ---------------------------------------------------------------
       1. BOTÓN "VOLVER ARRIBA" QUE APARECE AL BAJAR (evento "scroll")
       --------------------------------------------------------------- */
    const btnArriba = document.getElementById('btn-arriba');
    const ALTURA_PARA_MOSTRAR = 400; // píxeles que hay que bajar

    // Revisa cuánto bajó la página y muestra u oculta el botón.
    function revisarDesplazamiento() {
        if (window.scrollY > ALTURA_PARA_MOSTRAR) {
            btnArriba.classList.add('show');    // clase del template que lo hace visible
        } else {
            btnArriba.classList.remove('show');
        }
    }

    window.addEventListener('scroll', revisarDesplazamiento);
    revisarDesplazamiento(); // por si la página se abre ya desplazada

    /* ---------------------------------------------------------------
       2. VOLVER ARRIBA CON DESPLAZAMIENTO SUAVE (evento "click")
       --------------------------------------------------------------- */
    btnArriba.addEventListener('click', function (evento) {
        evento.preventDefault(); // evita el salto brusco del enlace #arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---------------------------------------------------------------
       3. MARCAR LA PÁGINA ACTUAL EN EL MENÚ
       Compara el nombre del archivo abierto (por ejemplo "carta.html")
       con el href de cada enlace del menú y le pone la clase is-active
       (la misma que ya usaba el diseño de la Ev. 2).
       --------------------------------------------------------------- */
    const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
    const enlacesMenu = document.querySelectorAll('.main-nav > a:not(.btn)');

    enlacesMenu.forEach(function (enlace) {
        if (enlace.getAttribute('href') === paginaActual) {
            enlace.classList.add('is-active');
            enlace.setAttribute('aria-current', 'page');
        }
    });
});
