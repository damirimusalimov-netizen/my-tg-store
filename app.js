(() => {
  const CART_KEY = 'lumini_cart_v2';
  let PRODUCTS = [];

  function $(s){ return document.querySelector(s); }
  function $all(s){ return Array.from(document.querySelectorAll(s)); }
  function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)||'[]'); } catch(e){ return []; } }
  function showToast(t){ const el=$('#toast'); if(!el)return; el.textContent=t; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),1500); }
  function safePrice(p){ const m=String(p).match(/\d+/); return m?+m[0]:0; }

  async function fetchProducts(){ const r=await fetch('products.json'); PRODUCTS=await r.json(); }
  function renderCatalog(list){ const cat=$('#catalog'); cat.innerHTML=''; list.forEach(p=>{ const el=document.createElement('div'); el.className='card'; el.innerHTML=`<img src="${p.image}" alt="${p.title}"><h3>${p.title}</h3><p class='price'>${p.price} ₽</p><button class='btn add' data-id='${p.id}'>Добавить в корзину</button>`; cat.appendChild(el); }); $all('.add').forEach(b=>b.onclick=()=>addToCart(b.dataset.id)); }
  function renderCategories(){ const nav=$('#categories'); const cats=[...new Set(PRODUCTS.map(p=>p.category))]; nav.innerHTML='<button class="btn" id="all">Все</button>'; cats.forEach(c=>{ const b=document.createElement('button'); b.className='btn'; b.textContent=c; b.onclick=()=>renderCatalog(PRODUCTS.filter(p=>p.category===c)); nav.appendChild(b); }); $('#all').onclick=()=>renderCatalog(PRODUCTS); }
  function addToCart(id){ const p=PRODUCTS.find(p=>p.id==id); if(!p)return; const cart=loadCart(); const e=cart.find(i=>i.id==id); e?e.qty++:cart.push({...p,qty:1,priceNum:safePrice(p.price)}); saveCart(cart); showToast('Добавлено в корзину'); }

  function renderCart(){ const list=$('#cart-list'); const cart=loadCart(); list.innerHTML=''; cart.forEach(i=>{ const row=document.createElement('div'); row.innerHTML=`<img src="${i.image}" alt="${i.title}"><div><strong>${i.title}</strong><br>${i.price} ₽ × ${i.qty}</div><button data-id='${i.id}' class='btn del'>Удалить</button>`; list.appendChild(row); }); $all('.del').forEach(b=>b.onclick=()=>{let c=loadCart().filter(i=>i.id!=b.dataset.id); saveCart(c); renderCart();}); $('#cart-total').textContent='Итого: '+cart.reduce((s,i)=>s+i.qty*i.priceNum,0)+' ₽'; }
  function checkout(){ const cart=loadCart(); const order={items:cart,total:cart.reduce((s,i)=>s+i.qty*i.priceNum,0)}; if(window.Telegram?.WebApp){ window.Telegram.WebApp.sendData(JSON.stringify(order)); showToast('Отправлено боту'); saveCart([]); renderCart(); } else { alert('WebApp API не найден'); } }

  document.addEventListener('DOMContentLoaded', async ()=>{
    const page=document.body.dataset.page;
    if(page==='shop'){ await fetchProducts(); renderCategories(); renderCatalog(PRODUCTS); }
    if(page==='cart'){ renderCart(); $('#clear-cart').onclick=()=>{saveCart([]); renderCart();}; $('#checkout').onclick=checkout; }
  });
})();