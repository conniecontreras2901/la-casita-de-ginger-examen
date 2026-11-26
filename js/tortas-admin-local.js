/* La Casita de Ginger | Administración local de Tortas
   Sin servidor ni base de datos: el catálogo y las fotos nuevas se guardan
   en localStorage de ESTE navegador. Credenciales solo demostrativas.
   El administrador vive en index.html para poder funcionar desde file:///.
   Autor: Jorge Aravena. Los cambios marcados con «Integración» los hizo
   Daniela González al unirlo con la sección de Tortas de Jorge Medina.
*/
(function () {
  'use strict';
  const KEY = 'ginger_tortas_catalogo_local_v1';
  const USER = 'Admin01';
  const PASSWORD = 'Ginger1234';
  const $ = id => document.getElementById(id);
  const make = (tag, className, content) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) el.textContent = content;
    return el;
  };
  let available = false;
  let originals = [];
  let cakes = [];
  let loggedIn = false;
  let selectedId = null;
  let pendingImage = '';
  let processingImage = false;
  let imageRequest = 0;

  function report(message, error = false) {
    const el = $('tortas-admin-status');
    el.textContent = message || '';
    el.classList.toggle('error', error);
    el.classList.toggle('ok', !!message && !error);
  }
  function storageWorks() {
    try {
      const test = KEY + '_probe';
      localStorage.setItem(test, 'ok');
      localStorage.removeItem(test);
      return true;
    } catch (_) { return false; }
  }
  function originalCakes() {
    return Array.from($('cake-grid').querySelectorAll('.cake-card')).map((card, idx) => {
      const special = card.classList.contains('cake-special');
      const prices = Array.from(card.querySelectorAll('.cake-prices li'));
      const textOf = selector => card.querySelector(selector)?.textContent.trim() || '';
      const obj = {
        id: 'original-torta-' + (idx + 1),
        tipo: card.getAttribute('data-tipo') || '', // Integración: categoría del filtro de Jorge Medina
        special,
        title: textOf('h3'),
        description: textOf('.cake-description'),
        price: special ? textOf('.cake-special-price') : textOf('.cake-price'),
        price20: '',
        price30: '',
        image: card.querySelector('.cake-photo')?.getAttribute('src') || ''
      };
      prices.forEach(row => {
        const label = row.querySelector('span')?.textContent.trim() || '';
        const value = row.querySelector('strong')?.textContent.trim() || '';
        if (label.includes('20')) obj.price20 = value;
        if (label.includes('30')) obj.price30 = value;
      });
      return obj;
    });
  }
  function validImage(src) {
    return typeof src === 'string' && src.length <= 430000 && (
      /^img\/optimizado\/[\w-]+\.(webp|png|jpe?g)$/i.test(src) ||
      /^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(src)
    );
  }
  function validCake(c) {
    return c && typeof c.id === 'string' && c.id.length < 100 &&
      typeof c.special === 'boolean' &&
      typeof c.title === 'string' && c.title.length > 0 && c.title.length <= 160 &&
      typeof c.description === 'string' && c.description.length <= 900 &&
      ['price','price20','price30'].every(key => typeof c[key] === 'string' && c[key].length <= 110) &&
      validImage(c.image) &&
      (c.tipo === undefined || (typeof c.tipo === 'string' && c.tipo.length < 30)); // Integración: categoría opcional
  }
  function readStored() {
    if (!available) return null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw === null) return null;
      const result = JSON.parse(raw);
      if (result && result.version === 1 && Array.isArray(result.cakes) &&
          result.cakes.length <= 150 && result.cakes.every(validCake)) return result.cakes;
    } catch (_) { /* corrupt data: use original list */ }
    return null;
  }
  function persist(next) {
    if (!available) {
      report('El navegador no permite guardar los cambios. Comprueba que localStorage esté habilitado.', true);
      return false;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify({version:1,cakes:next}));
      cakes = next;
      renderCakes();
      return true;
    } catch (_) {
      report('No se pudo guardar. Es posible que el navegador no tenga espacio suficiente para más fotografías.', true);
      return false;
    }
  }
  function priceLine(label, value) {
    const li = make('li');
    li.append(make('span','',label),make('strong','',value));
    return li;
  }
  function renderCakes() {
    const grid = $('cake-grid');
    const nodes = cakes.map(c => {
      // Integración (Daniela González): se mantienen la clase card-image del template y la categoría
      // data-tipo del filtro de Jorge Medina, para que el filtro siga funcionando con las tortas editadas.
      const card = make(c.special ? 'a' : 'article', c.special ? 'cake-card cake-special' : 'cake-card cake-direct card-image');
      if (c.special) card.href = '#torta-personalizada';
      if (!c.special) card.setAttribute('data-tipo', c.tipo || 'otra');
      const photo = make('img','cake-photo img-fluid');
      photo.src = c.image;
      photo.alt = 'Fotografía de ' + c.title;
      photo.loading = 'lazy';
      const info = make('div','cake-info');
      info.append(make('h3','',c.title));
      if (c.description) info.append(make('p','cake-description',c.description));
      if (c.special) {
        if (c.price) info.append(make('p','cake-special-price',c.price));
        info.append(make('span','cake-order','Ver más'));
      } else {
        if (c.price20 || c.price30) {
          const list = make('ul','cake-prices');
          if (c.price20) list.append(priceLine('20 personas',c.price20));
          if (c.price30) list.append(priceLine('30 personas',c.price30));
          info.append(list);
        } else if (c.price) {
          info.append(make('p','cake-price',c.price));
        }
        const order = make('a','cake-order','Pedir esta torta');
        // Integración: el enlace deja la torta elegida en el formulario de Constanza Contreras (?torta=).
        order.href = 'pedido.html?torta=' + encodeURIComponent(c.title);
        info.append(order);
      }
      card.append(photo,info);
      return card;
    });
    grid.replaceChildren(...nodes);
    if (!cakes.length) grid.append(make('p','tortas-admin-empty','No hay tortas disponibles en este momento.'));
    // Integración: avisa al filtro de Jorge Medina (js/tortas.js) que las tarjetas cambiaron.
    document.dispatchEvent(new CustomEvent('tortas:actualizadas'));
  }
  function setLoginUi() {
    $('tortas-admin-login-view').hidden = loggedIn;
    $('tortas-admin-panel-view').hidden = !loggedIn;
    $('tortas-admin-logout').hidden = !loggedIn;
  }
  function openAdmin() {
    $('tortas-admin-overlay').hidden = false;
    document.body.classList.add('ginger-admin-open');
    setLoginUi();
    if (loggedIn) { showList(); $('tortas-admin-search').focus(); }
    else $('tortas-admin-username').focus();
  }
  function closeAdmin() {
    imageRequest++;
    $('tortas-admin-overlay').hidden = true;
    $('tortas-admin-editor').hidden = true;
    document.body.classList.remove('ginger-admin-open');
    selectedId = null;
    pendingImage = '';
    report('');
  }
  function syncHash() {
    if (window.location.hash === '#administrar-tortas') openAdmin();
    else closeAdmin();
  }
  function closeWithHash() {
    if (window.location.hash === '#administrar-tortas') {
      try { history.replaceState(null,'',location.pathname + location.search + '#tortas'); }
      catch (_) { location.hash = 'tortas'; }
    }
    closeAdmin();
  }
  function showList() {
    const needle = $('tortas-admin-search').value.trim().toLocaleLowerCase('es');
    const list = $('tortas-admin-list');
    list.replaceChildren();
    cakes.filter(c => (c.title + ' ' + c.description + ' ' + c.price + ' ' + c.price20 + ' ' + c.price30)
      .toLocaleLowerCase('es').includes(needle)).forEach(c => {
      const row = make('div','ginger-admin-row tortas-admin-list-row');
      const mini = make('img','tortas-admin-list-image');
      mini.src = c.image;
      mini.alt = '';
      mini.loading = 'lazy';
      const info = make('div','tortas-admin-list-info');
      info.append(make('strong','',c.title),make('small','',c.price || [c.price20,c.price30].filter(Boolean).join(' / ') || 'Consultar'));
      const button = make('button','ginger-admin-btn light','Editar');
      button.type = 'button';
      button.addEventListener('click',() => openEditor(c.id));
      row.append(mini,info,button);
      list.append(row);
    });
    if (!list.childElementCount) list.append(make('p','ginger-admin-muted','No hay tortas que coincidan con la búsqueda.'));
    $('tortas-admin-count').textContent = cakes.length + ' tortas guardadas en este navegador';
  }
  function showPriceFields(isSpecial) {
    $('tortas-admin-price20-wrap').hidden = isSpecial;
    $('tortas-admin-price30-wrap').hidden = isSpecial;
    $('tortas-admin-price-label').textContent = isSpecial ? 'Precio o texto visible' : 'Precio único (opcional si indicas precios por personas)';
  }
  function showPreview(src) {
    const image = $('tortas-admin-preview');
    image.hidden = !src;
    if (src) image.src = src;
    else image.removeAttribute('src');
  }
  function openEditor(id) {
    imageRequest++;
    const current = cakes.find(c => c.id === id) || null;
    selectedId = current ? current.id : null;
    pendingImage = current ? current.image : '';
    processingImage = false;
    $('tortas-admin-save').disabled = false;
    $('tortas-admin-editor-title').textContent = current ? 'Editar torta' : 'Agregar torta';
    $('tortas-admin-name').value = current ? current.title : '';
    $('tortas-admin-description').value = current ? current.description : '';
    $('tortas-admin-price').value = current ? current.price : '';
    $('tortas-admin-price20').value = current ? current.price20 : '';
    $('tortas-admin-price30').value = current ? current.price30 : '';
    $('tortas-admin-photo').value = '';
    $('tortas-admin-photo-hint').textContent = current ? 'Puedes conservar la fotografía o seleccionar otra.' : 'Para agregar una torta debes seleccionar su fotografía.';
    showPriceFields(Boolean(current && current.special));
    showPreview(pendingImage);
    $('tortas-admin-delete').hidden = !current;
    $('tortas-admin-editor').hidden = false;
    report('');
    $('tortas-admin-name').focus();
    $('tortas-admin-editor').scrollIntoView({block:'nearest',behavior:'auto'});
  }
  function loadAndCompressPhoto(file) {
    return new Promise((resolve,reject) => {
      if (!file || !['image/jpeg','image/png','image/webp'].includes(file.type)) {
        reject(new Error('Selecciona una imagen JPG, PNG o WebP.'));
        return;
      }
      if (file.size > 16 * 1024 * 1024) { reject(new Error('La fotografía original supera los 16 MB.')); return; }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        try {
          let output = '';
          for (const option of [{size:760,q:.75},{size:650,q:.67},{size:540,q:.59},{size:450,q:.53}]) {
            const ratio = Math.min(1, option.size / Math.max(img.naturalWidth,img.naturalHeight));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1,Math.round(img.naturalWidth * ratio));
            canvas.height = Math.max(1,Math.round(img.naturalHeight * ratio));
            canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
            output = canvas.toDataURL('image/webp',option.q);
            if (!output.startsWith('data:image/webp;')) output = canvas.toDataURL('image/jpeg',option.q);
            if (output.length <= 330000) break;
          }
          if (!validImage(output)) throw new Error('La fotografía sigue siendo demasiado grande. Prueba con otra imagen.');
          resolve(output);
        } catch (err) { reject(err); }
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No fue posible abrir la fotografía seleccionada.')); };
      img.src = url;
    });
  }
  async function onPhoto(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const token = ++imageRequest;
    processingImage = true;
    $('tortas-admin-save').disabled = true;
    report('Preparando y comprimiendo la fotografía…');
    try {
      const data = await loadAndCompressPhoto(file);
      if (token !== imageRequest) return;
      pendingImage = data;
      showPreview(data);
      report('Fotografía lista. Pulsa «Guardar cambios» para conservarla.');
    } catch (err) {
      if (token === imageRequest) { event.target.value = ''; report(err.message || 'No se pudo procesar la fotografía.',true); }
    } finally {
      if (token === imageRequest) { processingImage = false; $('tortas-admin-save').disabled = false; }
    }
  }
  function onSave(event) {
    event.preventDefault();
    if (processingImage) { report('Espera a que termine de prepararse la fotografía.',true); return; }
    const title = $('tortas-admin-name').value.trim();
    const description = $('tortas-admin-description').value.trim();
    const price = $('tortas-admin-price').value.trim();
    const price20 = $('tortas-admin-price20').value.trim();
    const price30 = $('tortas-admin-price30').value.trim();
    const previous = cakes.find(c => c.id === selectedId) || null;
    const special = Boolean(previous && previous.special);
    if (!title || !pendingImage) { report('El nombre y una fotografía son obligatorios.',true); return; }
    if (!price && !price20 && !price30) { report('Ingresa un precio o una indicación como «Consultar».',true); return; }
    if (!special && price && (price20 || price30)) {
      report('Usa un precio único o los precios por personas, pero no ambos a la vez.',true); return;
    }
    const obj = {
      id:previous ? previous.id : ('torta-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8)),
      special, title, description, price, price20:special?'':price20, price30:special?'':price30, image:pendingImage,
      tipo: previous && previous.tipo ? previous.tipo : '' // Integración: conserva la categoría del filtro
    };
    if (!validCake(obj)) { report('Revisa los datos de la torta o el tamaño de la imagen.',true); return; }
    const next = previous ? cakes.map(c => c.id === previous.id ? obj : c) : [...cakes.filter(c => !c.special),obj,...cakes.filter(c => c.special)];
    if (!persist(next)) return;
    $('tortas-admin-editor').hidden = true;
    selectedId = null;
    pendingImage = '';
    showList();
    report('Cambios guardados. La sección Tortas ya está actualizada.');
  }
  function onDelete() {
    const existing = cakes.find(c => c.id === selectedId);
    if (!existing || !window.confirm('¿Eliminar «' + existing.title + '» de las tortas de este navegador?')) return;
    const next = cakes.filter(c => c.id !== existing.id);
    if (!persist(next)) return;
    $('tortas-admin-editor').hidden = true;
    selectedId = null;
    pendingImage = '';
    showList();
    report('Torta eliminada de este navegador.');
  }
  function init() {
    if (!$('cake-grid') || !$('tortas-admin-overlay')) return;
    available = storageWorks();
    originals = originalCakes();
    const saved = readStored();
    cakes = saved === null ? originals.map(c=>({...c})) : saved;
    if (saved !== null) renderCakes();
    $('tortas-admin-login-form').addEventListener('submit',event => {
      event.preventDefault();
      if ($('tortas-admin-username').value.trim() !== USER || $('tortas-admin-password').value !== PASSWORD) {
        report('Usuario o contraseña incorrectos.',true); return;
      }
      loggedIn = true;
      $('tortas-admin-password').value = '';
      report('');
      setLoginUi();
      showList();
      $('tortas-admin-search').focus();
    });
    $('tortas-admin-logout').addEventListener('click',() => {
      loggedIn = false;
      $('tortas-admin-editor').hidden = true;
      setLoginUi();
      report('');
      $('tortas-admin-username').focus();
    });
    $('tortas-admin-close').addEventListener('click',closeWithHash);
    $('tortas-admin-search').addEventListener('input',showList);
    $('tortas-admin-add').addEventListener('click',()=>openEditor(null));
    $('tortas-admin-cake-form').addEventListener('submit',onSave);
    $('tortas-admin-photo').addEventListener('change',onPhoto);
    $('tortas-admin-delete').addEventListener('click',onDelete);
    $('tortas-admin-cancel').addEventListener('click',() => { imageRequest++; $('tortas-admin-editor').hidden = true; selectedId = null; pendingImage = ''; report(''); });
    window.addEventListener('hashchange',syncHash);
    window.addEventListener('storage',event => {
      if (event.key !== KEY) return;
      const changed = readStored();
      cakes = changed === null ? originals.map(c=>({...c})) : changed;
      renderCakes();
      if (loggedIn) showList();
    });
    document.addEventListener('keydown',event => {
      if (event.key === 'Escape' && !$('tortas-admin-overlay').hidden) closeWithHash();
    });
    syncHash();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
