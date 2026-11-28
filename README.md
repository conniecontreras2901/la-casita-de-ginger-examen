# La Casita de Ginger

Sitio web para **La Casita de Ginger**, una pastelería y cafetería artesanal ubicada en Chillán, Región de Ñuble, inspirada en las casitas de jengibre y en la magia de la Navidad durante todo el año.

El sitio presenta la identidad de la marca, sus tortas, su carta, la historia de Ginger, la galletita protagonista, y permite preparar pedidos que se envían por WhatsApp.

**Sitio publicado:** [La Casita de Ginger](https://lacasitadeginger.netlify.app/)

![Página de inicio] <img width="1535" height="862" alt="inicio" src="https://github.com/user-attachments/assets/5778ab50-bec9-4b27-98bd-986fee188fe6" />


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

![La Carta]<img width="1535" height="862" alt="carta" src="https://github.com/user-attachments/assets/7483098d-190c-40f1-a6f7-a99fc5f4caf2" />


![Haz tu pedido]<img width="1535" height="862" alt="pedido" src="https://github.com/user-attachments/assets/d7a222d4-f168-426e-9460-34585ef11755" />


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

![Vista en celular]<img width="977" height="862" alt="celular" src="https://github.com/user-attachments/assets/2cfd59db-2d0b-4b70-a466-29493787f67c" />

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

- En línea: https://lacasitadeginger.netlify.app/
- En el computador: descargar el repositorio y abrir
  `index.html` en el navegador.
- El sitio se encuentra publicado en Netlify y conectado
  a la rama `main` del repositorio de GitHub, permitiendo
  su actualización automática al incorporar nuevos cambios.
- No requiere servidor propio ni comandos de compilación.

## Integrantes y aporte individual

<!-- Cada integrante revisa y completa su propia sección. -->

### Daniela González
Base del sitio y conexión del template sin perder la identidad visual, diseño (paleta de colores, tipografías y estilo de las secciones), Inicio, menú, `js/general.js`, integración de las partes del grupo, guion y edición del video y armado de la entrega.

### Jorge Aravena

Desarrollo y adaptación de las páginas La Carta y Conoce a Ginger al template seleccionado, reorganizando los productos e incorporando pestañas interactivas mediante JavaScript y los eventos `click` y `keydown`. Integración del cuento completo de Ginger, conservando sus ilustraciones originales y animaciones de cambio de página.

Implementación de los administradores locales de La Carta y Tortas, permitiendo agregar, editar y eliminar productos mediante JavaScript y `localStorage`, además del menú de navegación para dispositivos móviles.

Para el examen final, se realizó la publicación del sitio en Netlify, vinculándolo con GitHub para permitir su actualización automática, configurando la URL definitiva, verificando su funcionamiento y elaborando el archivo de enlaces para la entrega.

### Jorge Medina
Secciones Todas nuestras tortas, Torta personalizada y Experiencias: tarjetas del template, filtro por categoría (`js/tortas.js`), reseñas reales de Google Maps, pruebas del sitio publicado y capturas.

### Constanza Contreras
Me encargué de la adaptación inicial de la página Haz tu pedido y del pie de página al template, conservando la identidad visual del emprendimiento. Implementé la validación del formulario con los eventos blur y submit, los mensajes de error, la actualización del resumen con change y la preselección de la torta recibida desde Inicio. También preparé el mensaje de consulta para continuar en WhatsApp.

Para el examen creé el repositorio público de GitHub, envié las invitaciones a mis compañeros y cargué los archivos del sitio y el README. Participé en las pruebas de mi sección en computador, tablet y celular.

---

Proyecto académico de la asignatura Diseño Web · IPLACEX · 2026.
