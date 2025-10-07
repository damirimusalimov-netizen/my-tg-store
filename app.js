(() => {
  const CART_KEY = 'lumini_cart_v4';
  let PRODUCTS = [];

  const $ = s => document.querySelector(s);
  const $all = s => Array.from(document.querySelectorAll(s));

  const saveCart = cart => localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const loadCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');

  const showToast = msg => {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 1500);
  };

  const fetchProducts = async () => {
    const res = await fetch('products.json');
    PRODUCTS = await res.json();
    PRODUCTS.reverse(); // новые первыми
  };

  const renderCategories = () => {
    const nav = $('#categories');
    const cats = [...new Set(PRODUCTS.map(p => p.category))];
    nav.innerHTML = '<button class="active">Все</button>' + cats.map(c => `<button>${c}</button>`).join('');
    const buttons = $all('#categories button');
    buttons.forEach(b => {
      b.onclick = () => {
        buttons.forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        const cat = b.textContent === 'Все' ? PRODUCTS : PRODUCTS.filter(p => p.category === b.textContent);
        renderCatalog(cat);
      };
    });
  };

  const renderCatalog = (list) => {
    const container = $('#catalog');
    container.innerHTML = '';
    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p class="price">${p.price} ₽</p>
      `;
      card.onclick = () => addToCart(p.id);
      container.appendChild(card);
    });
  };

  const addToCart = id => {
    const p = PRODUCTS.find(x => x.id == id);
    const cart = loadCart();
    const ex = cart.find(i => i.id == id);
    ex ? ex.qty++ : cart.push({ ...p, qty: 1 });
    saveCart(cart);
    showToast('Добавлено в корзину');
  };

  const renderCart = () => {
    const list = $('#cart-list');
    const cart = loadCart();
    list.innerHTML = '';
    cart.forEach(i => {
      const el = document.createElement('div');
      el.innerHTML = `
        <img src="${i.image}" alt="">
        <div>
          <strong>${i.title}</strong><br>${i.price} ₽ × ${i.qty}
        </div>
        <button class="btn del" data-id="${i.id}">Удалить</button>`;
      list.appendChild(el);
    });
    $all('.del').forEach(b => b.onclick = () => {
      const c = loadCart().filter(x => x.id != b.dataset.id);
      saveCart(c);
      renderCart();
    });
    const total = cart.reduce((s, i) => s + i.qty * parseFloat(i.price), 0);
    $('#cart-total').textContent = `Итого: ${total.toFixed(0)} ₽`;
  };

  document.addEventListener('DOMContentLoaded', async () => {
    const page = document.body.dataset.page;
    if (page === 'shop') {
      await fetchProducts();
      renderCategories();
      renderCatalog(PRODUCTS);
    }
    if (page === 'cart') renderCart();
  });
})();
