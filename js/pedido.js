/*
 * AUTORA: CONSTANZA CONTRERAS — EVALUACIÓN 3
 *
 * Funciones:
 * - Validar campos con blur y submit.
 * - Actualizar el resumen con change.
 * - Preseleccionar una torta desde la dirección.
 * - Preparar la consulta para WhatsApp.
 *
 * Integración (Daniela González) — Examen final:
 * - Pedido de varias tortas: un contador (click en − / +, o escribir
 *   el número con input) crea una ficha por torta (Torta 1, Torta 2...)
 *   con su tipo, tamaño y un detalle opcional.
 * - El detalle de cada torta va en su ficha; el mensaje general queda
 *   opcional, solo para comentarios adicionales del pedido.
 * - El mensaje de WhatsApp incluye todas las tortas. Se abre ya escrito
 *   y la persona decide si lo envía o no.
 * - Precio de cada torta según su tamaño y total del pedido.
 *   La torta personalizada (o un tamaño distinto) queda «a conversar».
 *   Los precios son los de la sección Tortas del Inicio; si el
 *   administrador de Tortas (Jorge Aravena) los cambió en este navegador,
 *   se usan los precios guardados allí.
 */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const formulario = document.getElementById("form-pedido");

    if (!formulario) {
        return;
    }

    // Buscar los elementos del formulario.
    const nombre = document.getElementById("pedido-nombre");
    const telefono = document.getElementById("pedido-telefono");
    const correo = document.getElementById("pedido-correo");
    const fecha = document.getElementById("pedido-fecha");
    const mensaje = document.getElementById("pedido-mensaje");

    // Integración: elementos del pedido de varias tortas.
    const cantidad = document.getElementById("pedido-cantidad");
    const botonMenos = document.getElementById("tortas-menos");
    const botonMas = document.getElementById("tortas-mas");
    const listaTortas = document.getElementById("lista-tortas");
    const plantilla = document.getElementById("plantilla-torta");

    const boton = formulario.querySelector('button[type="submit"]');
    const aviso = document.getElementById("aviso-formulario");

    // Campos fijos (las tortas se agregan aparte, porque cambian).
    const campos = [
        nombre,
        telefono,
        correo,
        fecha,
        mensaje
    ];

    // No continuar si falta un elemento necesario.
    const faltaCampo = campos.concat([
        cantidad, botonMenos, botonMas, listaTortas, plantilla
    ]).some(function (campo) {
        return !campo;
    });

    if (faltaCampo || !boton || !aviso) {
        return;
    }

    const MIN_TORTAS = 1;
    const MAX_TORTAS = 10;

    /* ==========================================================
       Integración (Daniela González): precios de las tortas
       ========================================================== */

    // Precios de la sección «Todas nuestras tortas» del Inicio.
    const PRECIOS = {
        "Torta Amor": { "20 personas": 30000, "30 personas": 42000 },
        "Torta Caluga": { "20 personas": 30000, "30 personas": 40000 },
        "Torta Mocca Nuez": { "20 personas": 25000, "30 personas": 35000 },
        "Torta de Piña Clásica": { "20 personas": 25000, "30 personas": 35000 },
        "Torta 5 Leches": { "20 personas": 28000, "30 personas": 38000 },
        "Torta 7 Sabores": { "20 personas": 30000, "30 personas": 42000 },
        "Torta 3 Leches Maracuyá": { "20 personas": 30000, "30 personas": 42000 },
        "Torta Pompadour": { "20 personas": 30000, "30 personas": 42000 },
        "Torta Martuca": { "20 personas": 30000, "30 personas": 42000 },
        "Torta Sra. Ginger": { "20 personas": 32000, "30 personas": 45000 },
        "Torta Pie de Limón": { "20 personas": 28000, "30 personas": 40000 }
    };

    // Comparar nombres sin importar mayúsculas, tildes ni puntos.
    function claveNombre(texto) {
        return texto.toLocaleLowerCase("es")
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "");
    }

    // Pasar "$30.000" a 30000.
    function leerPrecio(texto) {
        const numero = parseInt(String(texto).replace(/\D/g, ""), 10);
        return Number.isNaN(numero) ? null : numero;
    }

    // Si el administrador de Tortas guardó precios en este navegador, usarlos.
    const preciosGuardados = {};

    try {
        const datos = JSON.parse(
            localStorage.getItem("ginger_tortas_catalogo_local_v1") || "null"
        );

        if (datos && Array.isArray(datos.cakes)) {
            datos.cakes.forEach(function (torta) {
                if (!torta || torta.special || !torta.title) {
                    return;
                }

                preciosGuardados[claveNombre(torta.title)] = {
                    "20 personas": leerPrecio(torta.price20),
                    "30 personas": leerPrecio(torta.price30)
                };
            });
        }
    } catch (error) {
        // Sin acceso a localStorage: se usan los precios del Inicio.
    }

    // Precio de una torta: un número, null si es «a conversar»,
    // o undefined si todavía falta elegir la torta o el tamaño.
    function precioDe(tipo, porciones) {
        if (!tipo || !porciones) {
            return undefined;
        }

        const guardado = preciosGuardados[claveNombre(tipo)];
        const tabla = guardado || PRECIOS[tipo];

        if (!tabla || !tabla[porciones]) {
            return null;
        }

        return tabla[porciones];
    }

    function formatearPesos(valor) {
        return "$" + valor.toLocaleString("es-CL");
    }

    // Texto del precio para mostrar.
    function textoPrecio(tipo, porciones) {
        const precio = precioDe(tipo, porciones);

        if (!tipo) {
            return "Elige una torta para ver su precio";
        }

        if (precio === undefined) {
            return tipo === "Torta personalizada"
                ? "Precio a conversar con el local"
                : "Elige el tamaño para ver el precio";
        }

        return precio === null
            ? "Precio a conversar con el local"
            : formatearPesos(precio);
    }

    /*
     * true: usar WhatsApp Web para esta prueba en computador.
     * false: usar wa.me, como solicita el plan del grupo.
     */
    const usarWhatsAppWeb = false;

    // Obtener la fecha local en formato año-mes-día.
    function obtenerHoy() {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0");
        const dia = String(hoy.getDate()).padStart(2, "0");

        return anio + "-" + mes + "-" + dia;
    }

    fecha.min = obtenerHoy();

    telefono.placeholder = "Ej.: 952281744";
    telefono.inputMode = "tel";

    // Crear el mensaje de error debajo de un campo y sus eventos.
    function prepararCampo(campo) {
        const error = document.createElement("p");

        error.id = "error-" + campo.id;
        error.classList.add("form-error");
        error.setAttribute("aria-live", "polite");

        campo.insertAdjacentElement("afterend", error);

        const descripcion =
            campo.getAttribute("aria-describedby") || "";

        campo.setAttribute(
            "aria-describedby",
            (descripcion + " " + error.id).trim()
        );

        // Revisar al salir del campo.
        campo.addEventListener("blur", function () {
            validarCampo(campo);
        });

        // Si ya había un error, revisar mientras se corrige.
        campo.addEventListener("input", function () {
            if (campo.classList.contains("campo-invalido")) {
                validarCampo(campo);
            }
        });
    }

    campos.forEach(prepararCampo);

    // Aceptar teléfono nacional o con prefijo de Chile.
    function normalizarTelefono(valor) {
        let limpio = valor.trim().replace(/[\s()-]/g, "");

        if (limpio.startsWith("+56")) {
            limpio = limpio.slice(3);
        } else if (/^56\d{9}$/.test(limpio)) {
            limpio = limpio.slice(2);
        }

        return limpio;
    }

    function mostrarError(campo, textoError) {
        const error = document.getElementById("error-" + campo.id);

        if (error) {
            error.textContent = textoError;
        }

        campo.classList.toggle(
            "campo-invalido",
            textoError !== ""
        );

        campo.setAttribute(
            "aria-invalid",
            textoError !== "" ? "true" : "false"
        );

        return textoError === "";
    }

    // Validar un campo y mostrar su mensaje.
    function validarCampo(campo) {
        const valor = campo.value.trim();
        let textoError = "";

        if (campo === fecha && campo.validity.badInput) {
            textoError = "Selecciona una fecha válida.";

        } else if (campo.required && valor === "") {
            textoError = campo.tagName === "SELECT"
                ? "Selecciona una torta."
                : "Completa este campo.";

        } else if (
            campo === telefono &&
            !/^\d{9}$/.test(normalizarTelefono(valor))
        ) {
            textoError =
                "Escribe un teléfono de 9 dígitos. Puedes incluir +56.";

        } else if (
            campo === correo &&
            valor !== "" &&
            campo.validity.typeMismatch
        ) {
            textoError =
                "Escribe un correo válido, por ejemplo nombre@correo.cl.";

        } else if (
            campo === fecha &&
            valor !== "" &&
            valor < obtenerHoy()
        ) {
            textoError =
                "La fecha de retiro no puede ser anterior a hoy.";
        }

        return mostrarError(campo, textoError);
    }

    /* ==========================================================
       Integración (Daniela González): fichas de tortas
       ========================================================== */

    // Crear la ficha de la torta número n a partir de la plantilla.
    function crearFichaTorta(n) {
        const ficha = plantilla.content.firstElementChild.cloneNode(true);

        const tipo = ficha.querySelector(".torta-tipo");
        const porciones = ficha.querySelector(".torta-porciones");
        const detalle = ficha.querySelector(".torta-detalle");

        tipo.id = "pedido-torta-" + n;
        porciones.id = "pedido-porciones-" + n;
        detalle.id = "pedido-detalle-" + n;

        ficha.querySelector(".torta-label-tipo").htmlFor = tipo.id;
        ficha.querySelector(".torta-label-porciones").htmlFor = porciones.id;
        ficha.querySelector(".torta-label-detalle").htmlFor = detalle.id;
        ficha.querySelector(".torta-titulo").textContent = "Torta " + n;

        tipo.name = "torta_" + n;
        porciones.name = "porciones_" + n;
        detalle.name = "detalle_" + n;

        prepararCampo(tipo);

        // Integración: línea con el precio de esta torta.
        const precio = document.createElement("p");
        precio.classList.add("torta-precio");
        precio.setAttribute("aria-live", "polite");
        ficha.append(precio);

        // Actualizar el resumen al cambiar la torta, el tamaño o el detalle.
        tipo.addEventListener("change", function () {
            validarCampo(tipo);
            actualizarResumen();
        });

        porciones.addEventListener("change", actualizarResumen);
        detalle.addEventListener("input", actualizarResumen);

        return ficha;
    }

    // Leer los datos de todas las fichas.
    function obtenerTortas() {
        return Array.from(
            listaTortas.querySelectorAll(".torta-item")
        ).map(function (ficha) {
            const tipo = ficha.querySelector(".torta-tipo");
            const porciones = ficha.querySelector(".torta-porciones").value;

            return {
                tipo: tipo,
                porciones: porciones,
                detalle: ficha.querySelector(".torta-detalle").value.trim(),
                precio: precioDe(tipo.value, porciones),
                ficha: ficha
            };
        });
    }

    // Dejar el número dentro del rango permitido.
    function limitarCantidad(valor) {
        const numero = parseInt(valor, 10);

        if (Number.isNaN(numero)) {
            return MIN_TORTAS;
        }

        return Math.min(MAX_TORTAS, Math.max(MIN_TORTAS, numero));
    }

    // Mostrar tantas fichas como indique el contador.
    // Las fichas que ya existen se conservan con lo que se haya elegido.
    function cambiarCantidad(nuevaCantidad) {
        const total = limitarCantidad(nuevaCantidad);
        let actuales = listaTortas.querySelectorAll(".torta-item").length;

        while (actuales < total) {
            actuales += 1;
            listaTortas.append(crearFichaTorta(actuales));
        }

        while (actuales > total) {
            listaTortas.lastElementChild.remove();
            actuales -= 1;
        }

        cantidad.value = total;
        botonMenos.disabled = total <= MIN_TORTAS;
        botonMas.disabled = total >= MAX_TORTAS;

        actualizarResumen();
    }

    botonMenos.addEventListener("click", function () {
        cambiarCantidad(Number(cantidad.value) - 1);
    });

    botonMas.addEventListener("click", function () {
        cambiarCantidad(Number(cantidad.value) + 1);
        // Llevar la vista a la torta recién agregada.
        listaTortas.lastElementChild.querySelector(".torta-tipo").focus();
    });

    // También se puede escribir el número directamente.
    cantidad.addEventListener("change", function () {
        cambiarCantidad(cantidad.value);
    });

    // Crear el resumen antes del botón.
    const resumen = document.createElement("div");
    resumen.id = "resumen-pedido";
    resumen.classList.add("pedido-resumen");
    resumen.setAttribute("aria-live", "polite");

    const tituloResumen = document.createElement("h3");
    tituloResumen.textContent = "Resumen de tu pedido";

    const listaResumen = document.createElement("ul");

    // Integración: total del pedido.
    const totalResumen = document.createElement("p");
    totalResumen.classList.add("pedido-total");

    const notaResumen = document.createElement("p");
    notaResumen.classList.add("pedido-nota");

    // Integración: comentarios adicionales dentro del resumen.
    const comentarioResumen = document.createElement("p");
    comentarioResumen.classList.add("pedido-comentario-resumen");

    resumen.append(
        tituloResumen,
        listaResumen,
        comentarioResumen,
        totalResumen,
        notaResumen
    );

    // Integración (Daniela González): en computador el resumen va en la
    // columna derecha, bajo los datos de contacto, y acompaña al formulario
    // al bajar. En celular va justo antes del botón, para verlo antes de enviar.
    const columnaLateral = document.querySelector(".pedido-side");
    const pantallaGrande = window.matchMedia("(min-width: 901px)");

    function ubicarResumen() {
        if (pantallaGrande.matches && columnaLateral) {
            columnaLateral.append(resumen);
        } else {
            boton.insertAdjacentElement("beforebegin", resumen);
        }
    }

    ubicarResumen();
    pantallaGrande.addEventListener("change", ubicarResumen);

    // Texto de una torta, usado en el resumen y en el mensaje.
    function describirTorta(torta, numero) {
        let texto = "Torta " + numero + ": " +
            (torta.tipo.value || "Sin seleccionar") +
            " — " + (torta.porciones || "Tamaño por coordinar");

        texto += " — " + textoPrecio(torta.tipo.value, torta.porciones);

        if (torta.detalle) {
            texto += " — Detalle: " + torta.detalle;
        }

        return texto;
    }

    // Integración: sumar las tortas con precio y contar las «a conversar».
    function calcularTotal(tortas) {
        let total = 0;
        let conPrecio = 0;
        let aConversar = 0;
        let incompletas = 0;

        tortas.forEach(function (torta) {
            if (typeof torta.precio === "number") {
                total += torta.precio;
                conPrecio += 1;
            } else if (torta.precio === null ||
                       torta.tipo.value === "Torta personalizada") {
                aConversar += 1;
            } else {
                incompletas += 1;
            }
        });

        return {
            total: total,
            conPrecio: conPrecio,
            aConversar: aConversar,
            incompletas: incompletas
        };
    }

    function textoTotal(calculo) {
        if (calculo.conPrecio === 0) {
            return calculo.aConversar > 0 && calculo.incompletas === 0
                ? "Total: a conversar con el local"
                : "Total: elige las tortas y sus tamaños";
        }

        let texto = "Total: " + formatearPesos(calculo.total);

        if (calculo.aConversar > 0) {
            texto += calculo.aConversar === 1
                ? " + 1 torta a conversar"
                : " + " + calculo.aConversar + " tortas a conversar";
        }

        if (calculo.incompletas > 0) {
            texto += " (falta elegir el tamaño de " +
                (calculo.incompletas === 1 ? "1 torta)" : calculo.incompletas + " tortas)");
        }

        return texto;
    }

    function actualizarResumen() {
        const tortas = obtenerTortas();

        listaResumen.replaceChildren();

        tortas.forEach(function (torta, indice) {
            const item = document.createElement("li");
            item.textContent = describirTorta(torta, indice + 1);
            listaResumen.append(item);

            // Precio dentro de la ficha de cada torta.
            torta.ficha.querySelector(".torta-precio").textContent =
                "Precio: " + textoPrecio(torta.tipo.value, torta.porciones);
        });

        // Comentarios adicionales escritos por el cliente.
        const comentario = mensaje.value.trim();
        comentarioResumen.textContent = comentario
            ? "Comentarios adicionales: " + comentario
            : "";

        const calculo = calcularTotal(tortas);
        totalResumen.textContent = textoTotal(calculo);

        // Nota solo cuando hay tortas que se cotizan conversando.
        notaResumen.textContent = calculo.aConversar > 0
            ? "Las tortas personalizadas o de otro tamaño se cotizan al conversar con el local, según lo que necesites."
            : "";

        tituloResumen.textContent = tortas.length === 1
            ? "Resumen de tu pedido (1 torta)"
            : "Resumen de tu pedido (" + tortas.length + " tortas)";
    }

    fecha.addEventListener("change", function () {
        validarCampo(fecha);
    });

    // Integración: mostrar los comentarios en el resumen mientras se escriben.
    mensaje.addEventListener("input", actualizarResumen);

    // Crear la primera ficha.
    cambiarCantidad(1);

    // Leer una torta enviada desde el enlace de otra página
    // (botón «Pedir esta torta»): se elige en la Torta 1.
    const parametros = new URLSearchParams(window.location.search);
    const tortaRecibida = parametros.get("torta");

    if (tortaRecibida) {
        const primeraTorta = document.getElementById("pedido-torta-1");

        const opcion = Array.from(primeraTorta.options).find(function (elemento) {
            return elemento.value.toLocaleLowerCase("es") ===
                tortaRecibida.trim().toLocaleLowerCase("es");
        });

        if (opcion && opcion.value !== "") {
            primeraTorta.value = opcion.value;
        } else {
            mostrarError(
                primeraTorta,
                "La torta del enlace no está en la lista. Selecciona una opción."
            );
        }
    }

    actualizarResumen();

    // Mostrar la fecha como día/mes/año.
    function formatearFecha(valor) {
        const partes = valor.split("-");

        return partes[2] + "/" + partes[1] + "/" + partes[0];
    }

    // Validar todo antes de continuar a WhatsApp.
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        fecha.min = obtenerHoy();

        const tortas = obtenerTortas();

        // Revisar los campos fijos y el tipo de cada torta.
        const aRevisar = campos.slice(0, 3)
            .concat(tortas.map(function (torta) { return torta.tipo; }))
            .concat(campos.slice(3));

        let primerError = null;

        aRevisar.forEach(function (campo) {
            const valido = validarCampo(campo);

            if (!valido && primerError === null) {
                primerError = campo;
            }
        });

        // Si hay errores, permanecer en el formulario.
        if (primerError) {
            primerError.focus();
            return;
        }

        // Preparar el mensaje con todos los datos del pedido.
        const lineasTortas = tortas.map(function (torta, indice) {
            return describirTorta(torta, indice + 1);
        });

        const texto = [
            "Hola, La Casita de Ginger. Quisiera hacer un pedido de " +
                (tortas.length === 1 ? "1 torta." : tortas.length + " tortas."),
            "",
            "Nombre: " + nombre.value.trim(),
            "Teléfono: +56 " + normalizarTelefono(telefono.value),
            "Correo: " + (correo.value.trim() || "No indicado"),
            "Fecha de retiro solicitada: " + formatearFecha(fecha.value),
            "",
            "Pedido:"
        ].concat(lineasTortas).concat([
            "",
            textoTotal(calcularTotal(tortas)),
            "",
            "Comentarios adicionales: " +
                (mensaje.value.trim() || "Sin comentarios"),
            "",
            calcularTotal(tortas).aConversar > 0
                ? "Quedo atenta/o para conversar los detalles de la torta personalizada."
                : "Quedo atenta/o a su respuesta. ¡Gracias!"
        ]).join("\n");

        let enlaceBase;

        if (usarWhatsAppWeb) {
            enlaceBase =
                "https://web.whatsapp.com/send?phone=56952281744&text=";
        } else {
            enlaceBase =
                "https://wa.me/56952281744?text=";
        }

        const direccion = enlaceBase + encodeURIComponent(texto);

        // WhatsApp se abre con el mensaje ya escrito:
        // la persona lo revisa y decide si lo envía o no.
        window.open(
            direccion,
            "_blank",
            "noopener,noreferrer"
        );
    });

    // Activar el botón cuando el formulario está preparado.
    aviso.textContent =
        "Completa los campos obligatorios marcados con *. " +
        "Al continuar se abrirá WhatsApp con tu pedido ya escrito: " +
        "revísalo y decide si lo envías al local.";

    boton.textContent = "Continuar en WhatsApp";
    boton.title = "Revisar y enviar tu pedido en WhatsApp";
    boton.disabled = false;
});
