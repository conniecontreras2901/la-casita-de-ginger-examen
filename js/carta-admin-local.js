/* La Casita de Ginger · administrador local de demostración.
   Funciona sin Node.js, servidores, peticiones HTTP ni base de datos.
   IMPORTANTE: las credenciales de esta demostración están en el JavaScript
   y NO proporcionan protección real ni un control de acceso seguro.
   Colocamos el editor dentro de carta.html para que el mismo archivo file://
   lea y escriba los datos incluso en navegadores que aíslan localStorage por archivo.
*/
(function () {
  'use strict';
  const STORAGE_KEY = 'ginger_carta_productos_local_v1';
  const USER = 'Admin01';
  const PASS = 'Ginger1234';
  const CATEGORIES = [
    {id:'desayunos', label:'Desayunos'},
    {id:'brunch', label:'Brunch'},
    {id:'dulces', label:'Algo rico para endulzar tu día'},
    {id:'cafeteria', label:'Cafetería'},
    {id:'bebidas', label:'Bebidas'},
    {id:'extras', label:'Extras'}
  ];
  const SUBGROUPS = ['Café de especialidad','Chocolate','Té','ICE · Preparaciones frías'];
  const byId = id => document.getElementById(id);
  let products = [];
  let loggedIn = false;
  let selectedId = null;
  let original = [];
  let storageAvailable = false;

  function testStorage() {
    try {
      const probe = STORAGE_KEY + '_test';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
      return true;
    } catch (err) { return false; }
  }
  function collectOriginal() {
    const output = [];
    CATEGORIES.forEach(category => {
      const panel = byId('panel-' + category.id);
      if (!panel) return;
      panel.querySelectorAll('.menu-item').forEach((article, idx) => {
        const subgroup = article.closest('.carta-subgroup');
        const heading = subgroup && subgroup.querySelector('h3');
        output.push({
          id: 'original-' + category.id + '-' + (idx + 1),
          category: category.id,
          subgroup: heading ? heading.textContent.trim() : '',
          title: article.querySelector('.menu-item-name')?.textContent.trim() || '',
          description: article.querySelector('.menu-item-desc')?.textContent.trim() || '',
          price: article.querySelector('.menu-item-price')?.textContent.trim() || ''
        });
      });
    });
    return output;
  }
  function validProduct(p) {
    return p && typeof p.id === 'string' && p.id.length < 100 &&
      CATEGORIES.some(c => c.id === p.category) &&
      typeof p.title === 'string' && p.title.length <= 160 &&
      typeof p.description === 'string' && p.description.length <= 800 &&
      typeof p.price === 'string' && p.price.length <= 100 &&
      typeof p.subgroup === 'string' &&
      (p.category !== 'cafeteria' || SUBGROUPS.includes(p.subgroup));
  }
  function readSaved() {
    if (!storageAvailable) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === null) return null;
      const data = JSON.parse(raw);
      if (!data || data.version !== 1 || !Array.isArray(data.products) ||
          data.products.length > 1000 || !data.products.every(validProduct)) return null;
      return data.products;
    } catch (err) { return null; }
  }
  function make(tag, cssClass, value) {
    const el = document.createElement(tag);
    if (cssClass) el.className = cssClass;
    if (value !== undefined && value !== null) el.textContent = value;
    return el;
  }
  function renderLine(container, subset) {
    container.replaceChildren();
    if (!subset.length) {
      const p = make('p','ginger-carta-empty','No hay productos disponibles en esta categoría por ahora.');
      p.style.gridColumn = '1 / -1';
      container.append(p);
      return;
    }
    subset.forEach(item => {
      const article = make('article','menu-item');
      const detail = make('div','menu-item-details');
      detail.append(make('h4','menu-item-name',item.title));
      if (item.description) detail.append(make('p','menu-item-desc',item.description));
      article.append(detail,make('span','menu-item-price',item.price));
      container.append(article);
    });
  }
  function renderPublic() {
    CATEGORIES.forEach(category => {
      const panel = byId('panel-' + category.id);
      if (!panel) return;
      const subgroups = Array.from(panel.querySelectorAll('.carta-subgroup'));
      if (subgroups.length) {
        subgroups.forEach(group => {
          const label = group.querySelector('h3')?.textContent.trim() || '';
          const container = group.querySelector('.menu-lines');
          if (container) renderLine(container, products.filter(item => item.category === category.id && item.subgroup === label));
        });
      } else {
        const container = panel.querySelector('.menu-lines');
        if (container) renderLine(container,products.filter(item => item.category === category.id));
      }
    });
  }
  function status(message, isError) {
    const node = byId('ginger-admin-status');
    node.textContent = message || '';
    node.classList.toggle('error',Boolean(isError));
    node.classList.toggle('ok',Boolean(message && !isError));
  }
  function save() {
    if (!storageAvailable) { status('Este navegador no permite guardar datos locales. Revisa su configuración de almacenamiento.',true); return false; }
    try {
      window.localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,products}));
      renderPublic();
      return true;
    } catch (err) {
      status('No se pudo guardar. Verifica que el navegador permita localStorage y tenga espacio disponible.',true);
      return false;
    }
  }
  function updateLoginUi() {
    byId('ginger-admin-login-view').hidden = loggedIn;
    byId('ginger-admin-panel-view').hidden = !loggedIn;
    byId('ginger-admin-signout').hidden = !loggedIn;
  }
  function openAdmin() {
    const overlay = byId('ginger-admin-overlay');
    overlay.hidden = false;
    document.body.classList.add('ginger-admin-open');
    updateLoginUi();
    if (loggedIn) { showProductList(); byId('ginger-admin-search').focus(); }
    else { byId('ginger-admin-username').focus(); }
  }
  function closeAdmin() {
    byId('ginger-admin-overlay').hidden = true;
    document.body.classList.remove('ginger-admin-open');
    byId('ginger-admin-editor').hidden = true;
    selectedId = null;
    status('',false);
  }
  function syncHash() {
    if (window.location.hash === '#administracion') openAdmin();
    else closeAdmin();
  }
  function closeViaHash() {
    if (window.location.hash === '#administracion') {
      // Reemplaza la URL sin recargar (también funciona desde file:///).
      try { window.history.replaceState(null,'',window.location.pathname + window.location.search + '#carta-completa'); }
      catch (err) { window.location.hash = 'carta-completa'; }
    }
    closeAdmin();
  }
  function setCategoryOptions() {
    const selector = byId('ginger-admin-category');
    CATEGORIES.forEach(cat => {
      const opt = new Option(cat.label,cat.id);
      selector.add(opt);
    });
    SUBGROUPS.forEach(name => byId('ginger-admin-subgroup').add(new Option(name,name)));
  }
  function showGroup() {
    const caf = byId('ginger-admin-category').value === 'cafeteria';
    byId('ginger-admin-subgroup-field').hidden = !caf;
    byId('ginger-admin-subgroup').disabled = !caf;
  }
  function showProductList() {
    const needle = byId('ginger-admin-search').value.toLocaleLowerCase('es').trim();
    const list = byId('ginger-admin-list');
    list.replaceChildren();
    let count = 0;
    products.forEach(p => {
      if (needle && ![p.title,p.description,p.price,p.category,p.subgroup].join(' ').toLocaleLowerCase('es').includes(needle)) return;
      count++;
      const row = make('div','ginger-admin-row');
      const info = make('div');
      info.append(make('strong','',p.title));
      const cat = CATEGORIES.find(c => c.id === p.category);
      info.append(make('small','',`${p.price} · ${cat ? cat.label : ''}${p.subgroup ? ' / '+p.subgroup : ''}`));
      const button = make('button','ginger-admin-btn light','Editar');
      button.type = 'button';
      button.addEventListener('click',()=>openEditor(p.id));
      row.append(info,button);
      list.append(row);
    });
    if (!count) list.append(make('p','ginger-admin-muted','No se encontraron productos.'));
    byId('ginger-admin-count').textContent = `${products.length} productos guardados en este navegador`;
  }
  function openEditor(id) {
    selectedId = id;
    const product = products.find(p => p.id === id);
    const fresh = !product;
    byId('ginger-admin-editor-title').textContent = fresh ? 'Agregar producto' : 'Editar producto';
    byId('ginger-admin-product-title').value = fresh ? '' : product.title;
    byId('ginger-admin-description').value = fresh ? '' : product.description;
    byId('ginger-admin-price').value = fresh ? '' : product.price;
    byId('ginger-admin-category').value = fresh ? 'desayunos' : product.category;
    showGroup();
    byId('ginger-admin-subgroup').value = fresh ? SUBGROUPS[0] : (product.subgroup || SUBGROUPS[0]);
    byId('ginger-admin-delete').hidden = fresh;
    byId('ginger-admin-editor').hidden = false;
    status('',false);
    byId('ginger-admin-product-title').focus();
    byId('ginger-admin-editor').scrollIntoView({block:'nearest',behavior:'auto'});
  }
  function uniqueId() {
    return 'nuevo-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,9);
  }
  function onSave(event) {
    event.preventDefault();
    const title = byId('ginger-admin-product-title').value.trim();
    const description = byId('ginger-admin-description').value.trim();
    const price = byId('ginger-admin-price').value.trim();
    const category = byId('ginger-admin-category').value;
    const subgroup = category === 'cafeteria' ? byId('ginger-admin-subgroup').value : '';
    if (!title || !price) { status('El nombre del producto y el precio son obligatorios.',true); return; }
    const prev = products.slice();
    const data = {id:selectedId || uniqueId(),title,description,price,category,subgroup};
    if (selectedId) {
      const index = products.findIndex(p => p.id === selectedId);
      if (index >= 0) products[index] = data;
      else { status('No se encontró el producto seleccionado.',true); return; }
    } else products.push(data);
    if (!save()) { products = prev; return; }
    byId('ginger-admin-editor').hidden = true;
    selectedId = null;
    showProductList();
    status('Cambios guardados en este navegador. Ya se reflejan en La Carta.',false);
  }
  function onDelete() {
    const p = products.find(item => item.id === selectedId);
    if (!p || !window.confirm(`¿Eliminar «${p.title}» de La Carta local?`)) return;
    const previous = products.slice();
    products = products.filter(item => item.id !== selectedId);
    if (!save()) { products = previous; return; }
    byId('ginger-admin-editor').hidden = true;
    selectedId = null;
    showProductList();
    status('Producto eliminado de la carta local.',false);
  }
  function init() {
    if (!byId('carta-panels') || !byId('ginger-admin-overlay')) return;
    storageAvailable = testStorage();
    original = collectOriginal();
    const fromStorage = readSaved();
    products = fromStorage === null ? original.map(p => ({...p})) : fromStorage;
    if (fromStorage !== null) renderPublic();
    setCategoryOptions();
    byId('ginger-admin-login-form').addEventListener('submit',event => {
      event.preventDefault();
      const username = byId('ginger-admin-username').value.trim();
      const password = byId('ginger-admin-password').value;
      if (username !== USER || password !== PASS) { status('Usuario o contraseña incorrectos.',true); return; }
      loggedIn = true;
      byId('ginger-admin-password').value = '';
      status('',false);
      updateLoginUi();
      showProductList();
      byId('ginger-admin-search').focus();
    });
    byId('ginger-admin-signout').addEventListener('click',()=>{
      loggedIn=false;
      byId('ginger-admin-editor').hidden=true;
      updateLoginUi();
      byId('ginger-admin-username').focus();
    });
    byId('ginger-admin-close').addEventListener('click',closeViaHash);
    byId('ginger-admin-search').addEventListener('input',showProductList);
    byId('ginger-admin-add').addEventListener('click',()=>openEditor(null));
    byId('ginger-admin-category').addEventListener('change',showGroup);
    byId('ginger-admin-product-form').addEventListener('submit',onSave);
    byId('ginger-admin-delete').addEventListener('click',onDelete);
    byId('ginger-admin-cancel').addEventListener('click',()=>{byId('ginger-admin-editor').hidden=true;selectedId=null;status('',false);});
    window.addEventListener('hashchange',syncHash);
    document.addEventListener('keydown',event=>{
      if (event.key === 'Escape' && !byId('ginger-admin-overlay').hidden) closeViaHash();
    });
    window.addEventListener('storage',event=>{
      if (event.key !== STORAGE_KEY) return;
      const saved = readSaved();
      products = saved === null ? original.map(p=>({...p})) : saved;
      renderPublic();
      if (loggedIn) showProductList();
    });
    syncHash();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
