/* Autor: Jorge Medina
   Filtro interactivo de tortas por categoría (Todas, Frutales, Crema y Chocolate)
   en la página principal de La Casita de Ginger. */

document.addEventListener('DOMContentLoaded', function () {
    const botonesFiltro = document.querySelectorAll('.filter-btn');
    let tarjetasTortas = document.querySelectorAll('.cake-card[data-tipo]');
    const textoEstado = document.getElementById('estado-filtro');

    if (!botonesFiltro.length || !tarjetasTortas.length) {
        return;
    }

    // Actualiza la clase activa de los botones según la categoría elegida
    function marcarBotonActivo(botonSeleccionado) {
        for (let i = 0; i < botonesFiltro.length; i++) {
            botonesFiltro[i].classList.remove('is-active');
        }
        botonSeleccionado.classList.add('is-active');
    }

    // Muestra u oculta las tarjetas según el atributo data-tipo y actualiza el contador
    function filtrarTortas(categoria) {
        let visibles = 0;

        for (let i = 0; i < tarjetasTortas.length; i++) {
            const tarjeta = tarjetasTortas[i];
            const tipoTorta = tarjeta.getAttribute('data-tipo');

            if (categoria === 'todas' || tipoTorta === categoria) {
                tarjeta.classList.remove('is-hidden');
                visibles++;
            } else {
                tarjeta.classList.add('is-hidden');
            }
        }

        if (textoEstado) {
            if (categoria === 'todas') {
                textoEstado.textContent = 'Mostrando todas las tortas (' + visibles + ')';
            } else {
                textoEstado.textContent = 'Mostrando tortas de la categoría seleccionada (' + visibles + ')';
            }
        }
    }

    // Integración (Daniela González): si el administrador de Tortas de Jorge Aravena cambia las tarjetas,
    // se vuelven a leer y se aplica otra vez la categoría que está marcada.
    document.addEventListener('tortas:actualizadas', function () {
        tarjetasTortas = document.querySelectorAll('.cake-card[data-tipo]');
        const activo = document.querySelector('.filter-btn.is-active');
        filtrarTortas(activo ? activo.getAttribute('data-filtro') : 'todas');
    });

    // Asocia el evento click a cada botón de filtro
    for (let i = 0; i < botonesFiltro.length; i++) {
        botonesFiltro[i].addEventListener('click', function () {
            const categoriaElegida = this.getAttribute('data-filtro');
            marcarBotonActivo(this);
            filtrarTortas(categoriaElegida);
        });
    }
});