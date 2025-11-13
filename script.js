/* script.js for JP Cosmetics & Fragrance */
const checkoutNumber = "2347087804491"; // +234 708 780 4491
const currencySymbol = "₦";

// Products (editable)
const products = [
  {
    id: "b1",
    category: "Body Care",
    name: "St. Ives Rose Water & Aloe Vera Body Wash",
    price: 7000,
    image: "images/stives_rose_aloe_bodywash.jpg",
    desc: "Hydrating body wash infused with rose water and aloe vera for soft, refreshed skin."
  },
  {
    id: "b2",
    category: "Body Care",
    name: "St. Ives Rose & Argan Oil Body Lotion",
    price: 8000,
    image: "images/stives_rose_argan_lotion.jpg",
    desc: "Lightweight lotion that nourishes and brightens with argan oil and rose extracts."
  },
  {
    id: "b3",
    category: "Body Care",
    name: "Nivea Perfect & Radiant Body Lotion",
    price: 4500,
    image: "images/nivea_perfect_radiant.jpg",
    desc: "Deep moisture care with SPF for glowing, even-toned skin."
  },
  {
    id: "b4",
    category: "Body Care",
    name: "Nivea Radiant & Beauty Even Glow Lotion",
    price: 5500,
    image: "images/nivea_radiant_beauty.jpg",
    desc: "Rich in vitamin C and pearl extract for smoother, more radiant skin."
  },
  {
    id: "b5",
    category: "Body Care",
    name: "Alpha Arbutin Sugar Scrub",
    price: 4000,
    image: "images/alpha_arbutin_scrub.jpg",
    desc: "Exfoliating sugar scrub that brightens and renews dull skin naturally."
  },
  {
    id: "b6",
    category: "Body Care",
    name: "Golden Glow Whitening Shower Cream & Lotion",
    price: 25000,
    image: "images/golden_glow_shower_cream.jpg",
    desc: "Dual-action brightening shower cream and lotion for silky, even skin."
  },
  {
    id: "b7",
    category: "Body Care",
    name: "S&K Duchess Glow Shower Gel - Variant A",
    price: 8000,
    image: "images/sk_duchess_shower_gel_1.jpg",
    desc: "Luxurious foam shower gel enriched with glow-boosting botanicals."
  },
  {
    id: "b8",
    category: "Fragrance",
    name: "Riggs",
    price: 3100,
    image: "images/sk_duchess_shower_gel_2.jpg",
    desc: "perfect for your daily scents."
  },
  {
    id: "f1",
    category: "Face Care",
    name: "Parley Goldie Beauty Cream",
    price: 4000,
    image: "images/parley_goldie_beauty_cream.jpg",
    desc: "Brightening face cream that smoothens texture and enhances your natural glow."
  },
  {
    id: "fr1",
    category: "Fragrance",
    name: "24K Perfume (Eau de Toilette)",
    price: 5000,
    image: "images/perfume_24k.jpg",
    desc: "Long-lasting luxury scent with warm floral and amber notes."
  }
];

// =====================
// CATEGORY FILTER FUNCTION
// =====================

const productGrid = document.getElementById("product-grid");
const catButtons = document.querySelectorAll(".cat-btn");

// Function to display products by category
function displayProducts(category = "All") {
  productGrid.innerHTML = ""; // Clear grid

  const filteredProducts =
    category === "All"
      ? products
      : products.filter(p => p.category === category);

  filteredProducts.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p class="price">₦${p.price.toLocaleString()}</p>
      <button class="add-btn" onclick="addToCart('${p.id}')">Add to Cart</button>
    `;
    productGrid.appendChild(card);
  });
}

// Category button click event
catButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const cat = btn.getAttribute("data-cat");
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    displayProducts(cat);
  });
});

// Show all products by default on page load
displayProducts();

// Helpers
function numberWithCommas(x){ return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function escapeHtml(s){ return (s+"").replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

// Render products into #product-grid (used on index and shop pages)
function renderProducts(filter = "all"){
  const productGrid = document.getElementById("product-grid");
  if(!productGrid) return;
  productGrid.innerHTML = "";
  const list = products.filter(p => filter === "all" ? true : p.category === filter);
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${escapeHtml(p.name)}" />
      <h4>${escapeHtml(p.name)}</h4>
      <div class="desc">${escapeHtml(p.desc)}</div>
      <div class="price">${currencySymbol}${numberWithCommas(p.price)}</div>
      <div class="actions">
        <button class="add-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    `;
    productGrid.appendChild(card);
    card.querySelector(".add-btn").addEventListener("click", () => addToCart(p.id));
  });
}

// Cart
let cart = loadCart();
function loadCart(){ try{ const raw = localStorage.getItem('jp_cart_v1'); return raw?JSON.parse(raw):[] }catch(e){return []} }
function saveCart(){ try{ localStorage.setItem('jp_cart_v1', JSON.stringify(cart)); }catch(e){} }
function addToCart(id, qty=1){ const it = cart.find(i=>i.id===id); if(it) it.qty+=qty; else cart.push({id,qty}); saveCart(); updateCartUI(); alert('Added to cart'); }
function removeFromCart(id){ cart = cart.filter(i=>i.id!==id); saveCart(); updateCartUI(); }
function updateQty(id, qty){ const it = cart.find(i=>i.id===id); if(!it) return; it.qty = qty; if(it.qty<=0) removeFromCart(id); saveCart(); updateCartUI(); }
function cartDetails(){ return cart.map(ci=>{ const p = products.find(pp=>pp.id===ci.id); return {...p, qty:ci.qty, lineTotal:p.price*ci.qty}; }); }
function cartTotal(){ return cartDetails().reduce((s,it)=>s+it.lineTotal,0); }

function updateCartUI(){
  const cartCount = document.getElementById('cart-count');
  if(cartCount) cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
  const cartItemsDiv = document.getElementById('cart-items');
  if(!cartItemsDiv) return;
  cartItemsDiv.innerHTML='';
  const items = cartDetails();
  if(items.length===0) cartItemsDiv.innerHTML='<p>Your cart is empty.</p>';
  else items.forEach(it=>{
    const el = document.createElement('div');
    el.className='cart-item';
    el.innerHTML = `<img src="${it.image}" /><div class="info"><h5>${escapeHtml(it.name)}</h5><small>${escapeHtml(it.desc)}</small><div class="muted">${currencySymbol}${numberWithCommas(it.price)} x ${it.qty} = <strong>${currencySymbol}${numberWithCommas(it.lineTotal)}</strong></div></div><div class="qty-controls"><button class="dec">-</button><span>${it.qty}</span><button class="inc">+</button><button class="remove">Remove</button></div>`;
    cartItemsDiv.appendChild(el);
    el.querySelector('.dec').addEventListener('click', ()=> updateQty(it.id, it.qty-1));
    el.querySelector('.inc').addEventListener('click', ()=> updateQty(it.id, it.qty+1));
    el.querySelector('.remove').addEventListener('click', ()=> removeFromCart(it.id));
  });
  const cartTotalSpan = document.getElementById('cart-total');
  if(cartTotalSpan) cartTotalSpan.textContent = numberWithCommas(cartTotal());
}

// Checkout via WhatsApp
 function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  const details = cartDetails();
  let lines = [];
  lines.push('🛍️ Order from JP Cosmetics & Fragrance');
  lines.push('');

  details.forEach(it => {
    lines.push(`${it.name} x ${it.qty} — ₦${numberWithCommas(it.lineTotal)}`);
  });

  lines.push('');
  lines.push(`Total: ₦${numberWithCommas(cartTotal())}`);
  lines.push('');
  lines.push('Customer Name:');
  lines.push('Pickup or Delivery (yes/no):');
  lines.push('Delivery Address (if delivery):');
  lines.push('Phone:');

  const message = encodeURIComponent(lines.join('\n'));
  const phoneNumber = '2347087804491'; // 👈 your WhatsApp number
  const waLink = `https://wa.me/${phoneNumber}?text=${message}`;

  // ✅ Works in both Kodex preview and live website
  window.location.href = waLink;
}

// Contact form -> opens WhatsApp with message
function contactFormHandler(e){
  e.preventDefault();
  const name = document.getElementById('cf-name').value || '';
  const email = document.getElementById('cf-email').value || '';
  const message = document.getElementById('cf-message').value || '';
  let lines = [];
  lines.push('Contact from website - JP Cosmetics & Fragrance');
  lines.push('');
  lines.push(`Name: ${name}`);
  lines.push(`Email: ${email}`);
  lines.push('Message:');
  lines.push(message);
  const waLink = `https://wa.me/${checkoutNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(waLink, '_blank');
}

// Init
document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts('all');
  updateCartUI();
  const cartBtn = document.getElementById('view-cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const closeCart = document.getElementById('close-cart');
  const clearCartBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout-whatsapp');
  if(cartBtn) cartBtn.addEventListener('click', ()=>{ if(cartModal) cartModal.classList.remove('hidden'); updateCartUI(); });
  if(closeCart) closeCart.addEventListener('click', ()=> cartModal.classList.add('hidden'));
  if(clearCartBtn) clearCartBtn.addEventListener('click', ()=> { if(confirm('Clear cart?')){ cart = []; saveCart(); updateCartUI(); } });
  if(checkoutBtn) checkoutBtn.addEventListener('click', checkoutWhatsApp);
  const cf = document.getElementById('contact-form');
  if(cf) cf.addEventListener('submit', contactFormHandler);
});