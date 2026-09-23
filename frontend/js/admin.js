const API = "http://127.0.0.1:8001/api";
const root = document.getElementById("admin-root");
let token = localStorage.getItem("nuvo_admin_token_v1") || "";
let orders = [];
let products = [];
let activeTab = "orders";

function escapeHtml(value) {
  return String(value || "").replace(/[&<>\"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[char]));
}
function loginView(error = "") {
  root.innerHTML = `<section class="admin-card admin-login"><h1 class="admin-title">NUVO Admin</h1><p>Sign in to manage orders and delivery status.</p><form id="login-form"><div class="field"><label>Email</label><input id="email" type="email" required placeholder="admin@nuvo.local"></div><div class="field"><label>Password</label><input id="password" type="password" required placeholder="Password"></div>${error ? `<p class="admin-error">${escapeHtml(error)}</p>` : ""}<button class="btn accent block">Log in</button></form></section>`;
  document.getElementById("login-form").onsubmit = async event => {
    event.preventDefault();
    const response = await fetch(`${API}/auth/`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({action:"login", email:email.value, password:password.value}) });
    const data = await response.json();
    if (!response.ok || !data.user?.is_admin) return loginView("Admin account required.");
    token = data.token; localStorage.setItem("nuvo_admin_token_v1", token); loadDashboard();
  };
}
async function loadDashboard() {
  const response = await fetch(`${API}/orders/`, { headers:{"X-Auth-Token":token} });
  if (response.status === 401) { localStorage.removeItem("nuvo_admin_token_v1"); token = ""; return loginView("Session expired."); }
  orders = await response.json();
  const productsResponse = await fetch(`${API}/products/`, { headers:{"X-Auth-Token":token} });
  products = productsResponse.ok ? await productsResponse.json() : [];
  const counts = status => orders.filter(order => order.status === status).length;
  root.innerHTML = `<section class="admin-shell"><div class="admin-top"><div><h1 class="admin-title">NUVO control room</h1><p>Live order and catalog management · refreshes every 10 seconds</p></div><button id="logout" class="btn ghost">Log out</button></div><div class="admin-grid"><div class="metric"><strong>${orders.length}</strong><span>Total orders</span></div><div class="metric"><strong>${counts("placed")}</strong><span>New orders</span></div><div class="metric"><strong>${counts("processing")}</strong><span>Processing</span></div><div class="metric"><strong>${counts("out_for_delivery")}</strong><span>Out for delivery</span></div></div><div class="admin-tabs"><button class="admin-tab ${activeTab === "orders" ? "active" : ""}" data-tab="orders">Orders</button><button class="admin-tab ${activeTab === "products" ? "active" : ""}" data-tab="products">Products</button></div>${activeTab === "orders" ? ordersView() : productsView()}</section>`;
  document.getElementById("logout").onclick = () => { localStorage.removeItem("nuvo_admin_token_v1"); token = ""; loginView(); };
  document.querySelectorAll(".admin-tab").forEach(tab => tab.onclick = () => { activeTab = tab.dataset.tab; loadDashboard(); });
  document.querySelectorAll(".status-select").forEach(select => select.onchange = async event => { await fetch(`${API}/orders/${event.target.dataset.id}/`, { method:"PATCH", headers:{"Content-Type":"application/json","X-Auth-Token":token}, body:JSON.stringify({status:event.target.value}) }); loadDashboard(); });
  const productForm = document.getElementById("product-form");
  if (productForm) productForm.onsubmit = async event => { event.preventDefault(); const form = new FormData(productForm); await fetch(`${API}/products/`, { method:"POST", headers:{"Content-Type":"application/json","X-Auth-Token":token}, body:JSON.stringify(Object.fromEntries(form)) }); loadDashboard(); };
  document.querySelectorAll(".product-toggle").forEach(button => button.onclick = async event => { await fetch(`${API}/products/${event.target.dataset.id}/`, { method:"PATCH", headers:{"Content-Type":"application/json","X-Auth-Token":token}, body:JSON.stringify({is_active:event.target.dataset.active !== "true"}) }); loadDashboard(); });
}
function ordersView() { return `<div class="admin-card"><table class="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Payment</th><th>Total</th><th>Status</th><th>Location</th></tr></thead><tbody>${orders.map(orderRow).join("") || `<tr><td colspan="7">No orders yet.</td></tr>`}</tbody></table></div>`; }
function productsView() { return `<div class="admin-card"><h2>Add new product</h2><form id="product-form" class="product-form"><div class="field"><label>Product name</label><input name="title" required placeholder="Everyday Backpack"></div><div class="field"><label>Category</label><select name="category"><option>Electronics</option><option>Fashion</option><option>Home & Living</option><option>Accessories</option></select></div><div class="field"><label>Price</label><input name="price" type="number" min="1" required placeholder="1999"></div><div class="field"><label>Image URL</label><input name="image" placeholder="https://..."></div><button class="btn accent">Add product</button></form><table class="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Visibility</th><th>Action</th></tr></thead><tbody>${products.map(product => `<tr><td><strong>${escapeHtml(product.title)}</strong><br><small>${escapeHtml(product.description)}</small></td><td>${escapeHtml(product.category)}</td><td>Rs. ${Number(product.price).toLocaleString("en-IN")}</td><td class="${product.is_active ? "active-pill" : "inactive-pill"}">${product.is_active ? "Live" : "Hidden"}</td><td><button class="product-toggle btn ghost" data-id="${product.id}" data-active="${product.is_active}">${product.is_active ? "Hide" : "Publish"}</button></td></tr>`).join("")}</tbody></table></div>`; }
function orderRow(order) {
  const statuses = ["placed","processing","shipped","out_for_delivery","delivered","cancelled"];
  const location = order.latitude && order.longitude ? `<a class="location-link" target="_blank" href="https://www.google.com/maps?q=${order.latitude},${order.longitude}">Open live map</a>` : "Not shared";
  return `<tr><td><strong>#${order.id}</strong><br><small>${new Date(order.created_at).toLocaleString("en-IN")}</small></td><td>${escapeHtml(order.customer_name)}<br><small>${escapeHtml(order.customer_phone)}<br>${escapeHtml(order.customer_email)}</small></td><td>${order.items.map(item => `${escapeHtml(item.title)} x ${item.qty}`).join("<br>")}</td><td>${escapeHtml(order.payment_method || "-")}</td><td>Rs. ${Number(order.total).toLocaleString("en-IN")}</td><td><select class="status-select" data-id="${order.id}">${statuses.map(status => `<option ${status === order.status ? "selected" : ""} value="${status}">${status.replaceAll("_", " ")}</option>`).join("")}</select></td><td>${location}</td></tr>`;
}
if (token) loadDashboard(); else loginView();
setInterval(() => { if (token) loadDashboard(); }, 10000);
