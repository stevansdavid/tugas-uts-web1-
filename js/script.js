// BOOKSTORE - SCRIPT UTAMA
// Data katalog, pengguna, dan tracking diambil dari file data.js yang diberikan dosen.
const rupiah = value => {
  if (typeof value === "string") {
    const digits = value.replace(/[^\d]/g, "");
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(digits) || 0);
  }
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value) || 0);
};
const angkaHarga = value => Number(String(value).replace(/[^\d]/g, "")) || 0;
const getData = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch (error) { return fallback; }
};
const saveData = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const getBooks = () => {
  const saved = getData("bookstore_books", null);
  return Array.isArray(saved) && saved.length && saved[0].kodeBarang ? saved : dataKatalogBuku.map(book => ({...book}));
};
const getOrders = () => getData("bookstore_orders", []);
const getTracking = () => { const saved = getData("bookstore_tracking", null); return saved && !Array.isArray(saved) ? saved : {...dataTracking}; };
const showModal = id => { const modal = document.getElementById(id); if (modal) { modal.classList.add("show"); modal.setAttribute("aria-hidden", "false"); } };
const closeModal = modal => { if (modal) { modal.classList.remove("show"); modal.setAttribute("aria-hidden", "true"); } };
const notify = message => alert(message);
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

// Modal global dan tombol keluar
document.querySelectorAll("[data-modal]").forEach(button => button.addEventListener("click", () => showModal(button.dataset.modal)));
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => closeModal(button.closest(".modal"))));
document.querySelectorAll(".modal").forEach(modal => modal.addEventListener("click", event => { if (event.target === modal) closeModal(modal); }));
document.querySelectorAll("[data-logout]").forEach(button => button.addEventListener("click", () => { localStorage.removeItem("bookstore_user"); location.href = "login.html"; }));

// LOGIN memakai dataPengguna dari dosen
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const akun = dataPengguna.find(user => user.email.toLowerCase() === email && user.password === password);
    if (!akun) return notify("email/password yang anda masukkan salah");
    saveData("bookstore_user", { id: akun.id, email: akun.email, nama: akun.nama, role: akun.role });
    location.href = "dashboard.html";
  });
}
const forgotForm = document.getElementById("forgotForm");
if (forgotForm) forgotForm.addEventListener("submit", event => { event.preventDefault(); notify("Fitur lupa password merupakan simulasi front-end."); closeModal(forgotForm.closest(".modal")); });
const registerForm = document.getElementById("registerForm");
if (registerForm) registerForm.addEventListener("submit", event => { event.preventDefault(); notify("Pendaftaran merupakan simulasi front-end. Gunakan akun yang tersedia pada data dosen."); closeModal(registerForm.closest(".modal")); registerForm.reset(); });

// DASHBOARD
if (document.body.dataset.page === "dashboard") {
  const currentUser = getData("bookstore_user", {nama:"Pengguna"});
  const jam = new Date().getHours();
  const greeting = document.getElementById("greeting");
  if (greeting) greeting.textContent = `${jam < 11 ? "Selamat pagi" : jam < 15 ? "Selamat siang" : jam < 18 ? "Selamat sore" : "Selamat malam"}, ${currentUser.nama}!`;
  document.querySelectorAll(".profile-mini strong").forEach(el => el.textContent = currentUser.nama);
  document.querySelectorAll(".top-user span:last-child").forEach(el => el.textContent = currentUser.nama);
  const books = getBooks(), orders = getOrders();
  document.getElementById("statBooks").textContent = books.length;
  document.getElementById("statStock").textContent = books.reduce((sum, book) => sum + Number(book.stok), 0);
  document.getElementById("statOrders").textContent = orders.length;
  document.getElementById("statTransactions").textContent = orders.length;
  const body = document.getElementById("historyTable");
  if (body) body.innerHTML = orders.length ? orders.slice().reverse().map(order => `<tr><td>${escapeHTML(order.id)}</td><td>${escapeHTML(order.nama)}</td><td>${escapeHTML(order.tanggal)}</td><td>${rupiah(order.total)}</td><td><span class="status-pill">${escapeHTML(order.status)}</span></td></tr>`).join("") : `<tr><td colspan="5" class="empty-cell">Belum ada transaksi. Buat pesanan pertama Anda.</td></tr>`;
}

// KATALOG BUKU: menggunakan field dari dataKatalogBuku milik dosen
if (document.body.dataset.page === "stok") {
  const table = document.getElementById("bookTable");
  const search = document.getElementById("bookSearch");
  function renderBooks(keyword = "") {
    const books = getBooks();
    const filtered = books.filter(book => `${book.kodeBarang} ${book.namaBarang} ${book.jenisBarang}`.toLowerCase().includes(keyword.toLowerCase()));
    table.innerHTML = filtered.length ? filtered.map(book => `<tr>
      <td><img src="${escapeHTML(book.cover)}" alt="${escapeHTML(book.namaBarang)}" class="book-cover-thumb" onerror="this.style.display='none'"></td>
      <td><strong>${escapeHTML(book.kodeBarang)}</strong></td>
      <td>${escapeHTML(book.namaBarang)}</td><td>${escapeHTML(book.jenisBarang)}</td><td>${escapeHTML(book.edisi)}</td>
      <td>${escapeHTML(book.harga)}</td><td><span class="${Number(book.stok) <= 200 ? "stock-low" : "stock-good"}">${book.stok} unit</span></td>
      <td><button class="table-action edit-book" data-id="${escapeHTML(book.kodeBarang)}">Edit</button> <button class="table-action danger delete-book" data-id="${escapeHTML(book.kodeBarang)}">Hapus</button></td></tr>`).join("") : `<tr><td colspan="8" class="empty-cell">Buku tidak ditemukan.</td></tr>`;
    document.getElementById("catalogCount").textContent = books.length;
    document.getElementById("catalogStock").textContent = books.reduce((sum, book) => sum + Number(book.stok), 0);
    document.getElementById("lowStock").textContent = books.filter(book => Number(book.stok) <= 200).length;
    document.getElementById("bookResultCount").textContent = `${filtered.length} buku ditampilkan`;
  }
  renderBooks();
  search.addEventListener("input", () => renderBooks(search.value));
  document.getElementById("openBookModal").addEventListener("click", () => {
    document.getElementById("bookForm").reset(); document.getElementById("bookId").value = "";
    document.getElementById("bookModalTitle").textContent = "Tambah Buku"; showModal("bookModal");
  });
  table.addEventListener("click", event => {
    const edit = event.target.closest(".edit-book"), del = event.target.closest(".delete-book");
    if (edit) {
      const book = getBooks().find(item => item.kodeBarang === edit.dataset.id); if (!book) return;
      document.getElementById("bookId").value = book.kodeBarang;
      document.getElementById("bookTitle").value = book.namaBarang;
      document.getElementById("bookAuthor").value = book.kodeBarang;
      document.getElementById("bookCategory").value = book.jenisBarang;
      document.getElementById("bookPrice").value = angkaHarga(book.harga);
      document.getElementById("bookStock").value = book.stok;
      document.getElementById("bookModalTitle").textContent = "Edit Buku"; showModal("bookModal");
    }
    if (del && confirm("Yakin ingin menghapus buku ini?")) {
      saveData("bookstore_books", getBooks().filter(item => item.kodeBarang !== del.dataset.id)); renderBooks(search.value); notify("Buku berhasil dihapus.");
    }
  });
  document.getElementById("bookForm").addEventListener("submit", event => {
    event.preventDefault();
    const books = getBooks(), code = document.getElementById("bookId").value;
    const item = { kodeBarang: code || "BK" + Date.now().toString().slice(-6), namaBarang: document.getElementById("bookTitle").value.trim(), jenisBarang: document.getElementById("bookCategory").value, edisi: "1", stok: Number(document.getElementById("bookStock").value), harga: rupiah(document.getElementById("bookPrice").value), cover: "img/pengantar_komunikasi.jpg" };
    if (code) {
      const index = books.findIndex(book => book.kodeBarang === code);
      if (index >= 0) { item.edisi = books[index].edisi; item.cover = books[index].cover; books[index] = item; }
    } else books.push(item);
    saveData("bookstore_books", books); renderBooks(search.value); closeModal(document.getElementById("bookModal")); notify("Data buku berhasil disimpan.");
  });
}

// CHECKOUT / PEMESANAN
if (document.body.dataset.page === "checkout") {
  let cart = [];
  const bookSelect = document.getElementById("orderBook");
  function loadBookOptions() {
    bookSelect.innerHTML = `<option value="">Pilih buku dari katalog</option>` + getBooks().filter(book => Number(book.stok) > 0).map(book => `<option value="${escapeHTML(book.kodeBarang)}">${escapeHTML(book.namaBarang)} — ${escapeHTML(book.harga)} (stok ${book.stok})</option>`).join("");
  }
  function renderCart() {
    const body = document.getElementById("orderItems");
    body.innerHTML = cart.length ? cart.map(item => `<tr><td>${escapeHTML(item.namaBarang)}</td><td>${rupiah(item.harga)}</td><td><input class="qty-input" type="number" min="1" max="${item.stok}" value="${item.qty}" data-qty="${escapeHTML(item.kodeBarang)}"></td><td>${rupiah(angkaHarga(item.harga) * item.qty)}</td><td><button type="button" class="table-action danger remove-item" data-id="${escapeHTML(item.kodeBarang)}">Hapus</button></td></tr>`).join("") : `<tr><td colspan="5" class="empty-cell">Belum ada buku yang dipilih.</td></tr>`;
    const subtotal = cart.reduce((sum, item) => sum + angkaHarga(item.harga) * item.qty, 0);
    document.getElementById("checkoutSubtotal").textContent = rupiah(subtotal);
    document.getElementById("checkoutTotal").textContent = rupiah(subtotal + 15000);
  }
  loadBookOptions(); renderCart();
  document.getElementById("addOrderItem").addEventListener("click", () => {
    const code = bookSelect.value, qty = Number(document.getElementById("orderQty").value);
    const book = getBooks().find(item => item.kodeBarang === code);
    if (!book) return notify("Silakan pilih buku terlebih dahulu.");
    if (!Number.isInteger(qty) || qty < 1) return notify("Jumlah buku minimal 1.");
    const existing = cart.find(item => item.kodeBarang === code), nextQty = (existing ? existing.qty : 0) + qty;
    if (nextQty > Number(book.stok)) return notify("Jumlah melebihi stok yang tersedia.");
    if (existing) existing.qty = nextQty; else cart.push({...book, qty});
    renderCart(); bookSelect.value = ""; document.getElementById("orderQty").value = 1;
  });
  document.getElementById("orderItems").addEventListener("click", event => {
    const button = event.target.closest(".remove-item"); if (button) { cart = cart.filter(item => item.kodeBarang !== button.dataset.id); renderCart(); }
  });
  document.getElementById("orderItems").addEventListener("change", event => {
    if (!event.target.matches("[data-qty]")) return;
    const item = cart.find(row => row.kodeBarang === event.target.dataset.qty), qty = Number(event.target.value);
    if (!item) return;
    if (!Number.isInteger(qty) || qty < 1 || qty > Number(item.stok)) { notify("Jumlah tidak valid atau melebihi stok."); renderCart(); return; }
    item.qty = qty; renderCart();
  });
  document.getElementById("checkoutForm").addEventListener("submit", event => {
    event.preventDefault();
    if (!cart.length) return notify("Tambahkan minimal satu buku ke pesanan.");
    const name = document.getElementById("customerName").value.trim(), email = document.getElementById("customerEmail").value.trim();
    const phone = document.getElementById("customerPhone").value.trim(), address = document.getElementById("customerAddress").value.trim();
    const payment = document.getElementById("paymentMethod").value, shipping = document.getElementById("shippingMethod").value;
    if (!name || !email || !phone || !address || !payment || !shipping) return notify("Mohon lengkapi semua informasi pemesan dan pembayaran.");
    const books = getBooks();
    for (const item of cart) { const stockBook = books.find(book => book.kodeBarang === item.kodeBarang); if (!stockBook || Number(stockBook.stok) < item.qty) return notify(`Stok ${item.namaBarang} tidak mencukupi.`); }
    cart.forEach(item => { const stockBook = books.find(book => book.kodeBarang === item.kodeBarang); stockBook.stok = Number(stockBook.stok) - item.qty; });
    saveData("bookstore_books", books);
    const subtotal = cart.reduce((sum, item) => sum + angkaHarga(item.harga) * item.qty, 0);
    const orderId = "ORD-" + Date.now().toString().slice(-8);
    const doNumber = "DO-" + new Date().toISOString().slice(0,10).replaceAll("-","") + "-" + Math.floor(1000 + Math.random() * 9000);
    const date = new Date().toISOString().slice(0,10);
    const order = { id: orderId, do: doNumber, nama: name, email, telepon: phone, alamat: address, items: cart, subtotal, total: subtotal + 15000, pembayaran: payment, ekspedisi: shipping, tanggal: date, status: "Dalam Perjalanan", paket: "Reguler" };
    const orders = getOrders(); orders.push(order); saveData("bookstore_orders", orders);
    const tracking = getTracking();
    tracking[doNumber] = { nomorDO: doNumber, nama: name, status: "Dalam Perjalanan", ekspedisi: shipping, tanggalKirim: date, paket: "Reguler", total: rupiah(order.total), perjalanan: [{waktu: new Date().toLocaleString("sv-SE"), keterangan: "Pesanan diterima dan sedang diproses oleh toko."}] };
    saveData("bookstore_tracking", tracking);
    notify(`Pesanan berhasil dibuat!\nNomor Pesanan: ${orderId}\nNomor Delivery Order: ${doNumber}\nTotal: ${rupiah(order.total)}`);
    cart = []; event.target.reset(); loadBookOptions(); renderCart();
  });
}

// TRACKING menggunakan dataTracking (object dengan nomor DO sebagai key) dari dosen
if (document.body.dataset.page === "tracking") {
  document.getElementById("trackingForm").addEventListener("submit", event => {
    event.preventDefault();
    const number = document.getElementById("trackingNumber").value.trim();
    const suppliedTracking = dataTracking[number];
    const savedTrackingRaw = getData("bookstore_tracking", {});
    const savedTracking = Array.isArray(savedTrackingRaw) ? {} : savedTrackingRaw;
    const data = savedTracking[number] || suppliedTracking;
    const result = document.getElementById("trackingResult");
    result.classList.remove("hidden");
    if (!data) { result.innerHTML = `<div class="empty-tracking"><h2>Pesanan tidak ditemukan</h2><p class="muted">Periksa kembali nomor Delivery Order yang Anda masukkan.</p></div>`; return; }
    const journey = Array.isArray(data.perjalanan) ? data.perjalanan : [];
    const progress = Math.min(100, Math.max(20, journey.length * 20));
    result.innerHTML = `<div class="tracking-result-head"><div><span class="eyebrow">DELIVERY ORDER</span><h2>${escapeHTML(data.nomorDO)}</h2></div><span class="status-pill">${escapeHTML(data.status)}</span></div>
      <h3>Halo, ${escapeHTML(data.nama)}!</h3><p class="muted">Berikut informasi pengiriman berdasarkan data tracking.</p>
      <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
      <div class="detail-grid"><div><small>Nama Pemesan</small><strong>${escapeHTML(data.nama)}</strong></div><div><small>Ekspedisi</small><strong>${escapeHTML(data.ekspedisi)}</strong></div><div><small>Tanggal Kirim</small><strong>${escapeHTML(data.tanggalKirim)}</strong></div><div><small>Jenis Paket</small><strong>${escapeHTML(data.paket)}</strong></div><div><small>Total Pembayaran</small><strong>${escapeHTML(data.total)}</strong></div><div><small>Status</small><strong>${escapeHTML(data.status)}</strong></div></div>
      <div class="divider"></div><h3>Riwayat Perjalanan Paket</h3><div class="journey-list">${journey.map(step => `<div class="journey-item"><strong>${escapeHTML(step.waktu)}</strong><p>${escapeHTML(step.keterangan)}</p></div>`).join("")}</div>`;
  });
}
