# La Casita de Ginger

Sitio web para **La Casita de Ginger**, una pastelería y cafetería artesanal ubicada en Chillán, Región de Ñuble, inspirada en las casitas de jengibre y en la magia de la Navidad durante todo el año.

El sitio presenta la identidad de la marca, sus tortas, su carta, la historia de Ginger, la galletita protagonista, y permite preparar pedidos que se envían por WhatsApp.

**Sitio publicado:** Pendiente de publicación en Netlify.

![Página de inicio](capturas/inicio.png)

---

## Objetivo

Crear un sitio web que transmita la identidad cálida y familiar que pidió la emprendedora, muestre su catálogo de forma clara y facilite el contacto y los pedidos, aplicando HTML, CSS, JavaScript y eventos sobre un template estándar.

## Tecnologías

- **HTML5**: estructura de las páginas.
- **CSS3**: diseño, colores, tipografías y adaptación a celular y tablet.
- **JavaScript**: funcionalidades interactivas mediante eventos, en archivos externos.
- **Template Assan Restaurant (Bootstrap 4)**: grilla, tarjetas, pestañas, testimonios y formulario.
- **GitHub** para el repositorio y **Netlify** para la publicación.

## Diseño e identidad visual

Se mantuvo la identidad definida con la emprendedora y se adaptó a la estructura del template.

| Elemento | Detalle |
|---|---|
| Color principal | Rojo vino `#8c1723` |
| Color secundario | Verde pino `#344226` |
| Fondos | Crema y vainilla `#fff9ef`, `#f5e3cc` |
| Detalles | Caramelo `#be8355` y dorado `#e8b866` |
| Títulos | Playfair Display |
| Textos | DM Sans |
| Personaje | Ginger, la galletita de jengibre |

## Páginas

| Página | Archivo | Contenido |
|---|---|---|
| Inicio | `index.html` | Bienvenida, tortas con filtro, torta personalizada, reseñas, quiénes somos, misión y visión, ubicación |
| Conoce a Ginger | `ginger.html` | Libro interactivo con la historia de Ginger, aventuras y su misión |
| La Carta | `carta.html` | Carta por categorías en pestañas y preparaciones especiales |
| Haz tu pedido | `pedido.html` | Formulario para pedir una o varias tortas y enviarlas por WhatsApp |

![La Carta](capturas/carta.png)

![Haz tu pedido](capturas/pedido.png)

## Funcionalidades JavaScript y eventos

| Archivo | Funcionalidad | Eventos |
|---|---|---|
| `js/general.js` | Botón «Volver arriba» y página actual marcada en el menú | `scroll`, `click` |
| `js/tortas.js` | Filtro de tortas por categoría con contador | `click` |
| `js/carta.js` | Pestañas de La Carta, también con teclado | `click`, `keydown` |
| `js/carta-admin-local.js` | Administrador local de La Carta | `submit`, `click`, `change` |
| `js/tortas-admin-local.js` | Administrador local de Tortas, con fotos | `submit`, `click`, `change` |
| `js/assan-nav.js` | Menú de navegación en celular | `click`, `keydown` |
| `js/pedido.js` | Pedido de varias tortas: contador, precios, total, validación y mensaje de WhatsApp | `click`, `input`, `change`, `blur`, `submit` |

> Los administradores locales son una demostración: guardan los cambios en el navegador (localStorage). Usuario `Admin01`, contraseña `Ginger1234`.

## Diseño responsivo

El sitio se adapta a computador, tablet y celular. En pantallas pequeñas el menú se abre con un botón.

![Vista en celular](capturas/celular.png)

## Estructura del proyecto

```
├── index.html
├── ginger.html
├── carta.html
├── pedido.html
├── README.md
├── capturas/              imágenes de este README
├── css/
│   ├── template.css       conexión del template
│   ├── plugins/ y style-restaurant.css   template Assan (sin editar)
│   ├── base.css, inicio.css
│   ├── ginger.css, ginger-cuento-completo.css, carta.css
│   ├── assan-adaptacion.css, carta-admin-local.css, tortas-admin-local.css
│   ├── tortas.css
│   └── pedido.css, footer.css
├── js/
│   ├── plugins/           template (jQuery y Bootstrap)
│   ├── general.js
│   ├── carta.js, carta-admin-local.js, tortas-admin-local.js, assan-nav.js
│   ├── tortas.js
│   └── pedido.js
├── img/optimizado/        imágenes del sitio
└── fonts/ y bower_components/
```

## Cómo ver el proyecto

- En línea: pendiente de publicación en Netlify.
- En el computador: descargar el repositorio y abrir `index.html` en el navegador. No necesita servidor.

## Integrantes y aporte individual

<!-- Cada integrante revisa y completa su propia sección. -->

### Daniela González
Base del sitio y conexión del template sin perder la identidad visual, diseño (paleta de colores, tipografías y estilo de las secciones), Inicio, menú, `js/general.js`, integración de las partes del grupo, guion y edición del video y armado de la entrega.

### Jorge Aravena
Páginas La Carta y Conoce a Ginger: carta con pestañas del template (`js/carta.js`), preparaciones especiales, libro con la historia de Ginger, administradores locales de La Carta y de Tortas, menú para celular (`js/assan-nav.js`) y publicación en Netlify.

### Jorge Medina
Secciones Todas nuestras tortas, Torta personalizada y Experiencias: tarjetas del template, filtro por categoría (`js/tortas.js`), reseñas reales de Google Maps, pruebas del sitio publicado y capturas.

### Constanza Contreras
Página Haz tu pedido y pie de página: formulario adaptado del template, validación y envío por WhatsApp (`js/pedido.js`), repositorio de GitHub y este README.

---

Proyecto académico de la asignatura Diseño Web · IPLACEX · 2026.
