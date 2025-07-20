const apiBaseUrl = "http://localhost:3000"; // sesuaikan jika beda host/port

function showResult(data) {
  const resultEl = document.getElementById("result");
  resultEl.textContent = JSON.stringify(data, null, 2);
  window.lastJSON = data;
}

function copyJSON() {
  if (!window.lastJSON) return;
  const text = JSON.stringify(window.lastJSON, null, 2);
  navigator.clipboard.writeText(text).then(() => {
    alert("Output berhasil disalin!");
  });
}

async function getData(endpoint) {
  try {
    const res = await fetch(apiBaseUrl + endpoint);
    const data = await res.json();
    showResult(data);
  } catch (err) {
    showResult(err.message);
  }
}

document.getElementById("getByIdForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const type = document.getElementById("getType").value;
  const id = document.getElementById("getId").value;

  try {
    const res = await fetch(`${apiBaseUrl}/${type}/${id}`);
    const data = await res.json();
    showResult(data);
  } catch (err) {
    showResult(err.message);
  }
});

document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const type = document.getElementById("postType").value;
  const nama = document.getElementById("postNama").value;
  const harga = document.getElementById("postHarga").value;

  const payload = type === "users"
    ? { username: nama, password: harga }
    : { nama, harga };

  try {
    const res = await fetch(`${apiBaseUrl}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    showResult(data);
  } catch (err) {
    showResult(err.message);
  }
});

document.getElementById("putForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const type = document.getElementById("putType").value;
  const id = document.getElementById("putId").value;
  const nama = document.getElementById("putNama").value;
  const harga = document.getElementById("putHarga").value;

  const body = {};
  if (type === "users") {
    if (nama) body.username = nama;
    if (harga) body.password = harga;
  } else {
    if (nama) body.nama = nama;
    if (harga) body.harga = harga;
  }

  try {
    const res = await fetch(`${apiBaseUrl}/${type}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    showResult(data);
  } catch (err) {
    showResult(err.message);
  }
});

document.getElementById("deleteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const type = document.getElementById("deleteType").value;
  const id = document.getElementById("deleteId").value;

  try {
    const res = await fetch(`${apiBaseUrl}/${type}/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    showResult(data);
  } catch (err) {
    showResult(err.message);
  }
});

document.getElementById("pesanForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = document.getElementById("pesanUserId").value;
  const namaItem = document.getElementById("pesanItem").value;
  const total = document.getElementById("pesanTotal").value;
  const jenis = document.getElementById("pesanJenis").value;

  const payload = { namaItem, total: parseInt(total), jenis };

  try {
    const res = await fetch(`${apiBaseUrl}/users/${userId}/pesan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    showResult(data);
  } catch (err) {
    showResult(err.message);
  }
});

document.getElementById("getPesananForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = document.getElementById("getPesananUserId").value;

  try {
    const res = await fetch(`${apiBaseUrl}/users/${userId}/pesanan`);
    const data = await res.json();
    showResult(data);
  } catch (err) {
    showResult(err.message);
  }
});

document.getElementById("deletePesananForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = document.getElementById("deletePesananUserId").value;
  const pesananId = document.getElementById("deletePesananId").value;

  const endpoint = pesananId
    ? `/users/${userId}/pesanan/${pesananId}`
    : `/users/${userId}/pesanan`;

  try {
    const res = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: "DELETE"
    });
    const data = await res.json();
    showResult(data);
  } catch (err) {
    showResult(err.message);
  }
});