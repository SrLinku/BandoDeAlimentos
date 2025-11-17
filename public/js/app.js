// app.js
function qs(s) {
  return document.querySelector(s);
}

function qsa(s) {
  return Array.from(document.querySelectorAll(s));
}

function alertBox(type, msg) {
  const c = qs("#alerts");
  if (!c) return;
  c.innerHTML = `<div class="alert ${type}">${msg}</div>`;
}

async function api(url, opts = {}) {
  const res = await fetch(url, Object.assign({ headers: { "Content-Type": "application/json" } }, opts));
  if (!res.ok) {
    let j = {};
    try {
      j = await res.json();
    } catch {}
    throw new Error(j.msg || res.statusText);
  }
  return res.json();
}

function setUser(u) {
  localStorage.setItem("user", JSON.stringify(u));
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.assign("/");
}

function ensureAuth() {
  const u = getUser();
  if (!u) {
    window.location.assign("/");
    return false;
  }
  const name = (u.nome || "U").substring(0, 1).toUpperCase();
  const av = qs(".avatar");
  if (av) av.textContent = name;
  const btn = qs("#btnLogout");
  if (btn) btn.addEventListener("click", logout);
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
  return true;
}

function saveRemember(email, senha, checked) {
  if (checked) {
    localStorage.setItem("remember", "1");
    localStorage.setItem("remember_email", email);
    localStorage.setItem("remember_senha", senha);
  } else {
    localStorage.removeItem("remember");
    localStorage.removeItem("remember_email");
    localStorage.removeItem("remember_senha");
  }
}

function loadRemember() {
  if (localStorage.getItem("remember") === "1") {
    return { email: localStorage.getItem("remember_email") || "", senha: localStorage.getItem("remember_senha") || "", checked: true };
  }
  return { email: "", senha: "", checked: false };
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
});

function initLayoutEnhancements() {
  var hb = document.getElementById("btnHamburger");
  var sidebar = document.querySelector(".sidebar");
  if (hb && sidebar) {
    hb.addEventListener("click", function () {
      document.body.classList.toggle("sidebar-open");
    });
  }

  try {
    var here = location.pathname.replace(/\/+$/, "") || "/";
    document.querySelectorAll(".nav a").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.replace(/\/+$/, "") === here) {
        a.classList.add("active");
      }
    });
  } catch (e) {}

  var loginForm = document.querySelector('form[data-form="login"]');
  if (loginForm) {
    var chk = loginForm.querySelector("#remember");
    var email = loginForm.querySelector("#email");
    var senha = loginForm.querySelector("#senha");

    try {
      var saved = JSON.parse(localStorage.getItem("remember_login") || "{}");
      if (saved.email) {
        email.value = saved.email;
      }
      if (saved.senha) {
        senha.value = saved.senha;
      }
      if (saved.email || saved.senha) {
        chk && (chk.checked = true);
      }
    } catch (e) {}

    loginForm.addEventListener("submit", function () {
      if (chk && chk.checked) {
        localStorage.setItem("remember_login", JSON.stringify({ email: email.value || "", senha: senha.value || "" }));
      } else {
        localStorage.removeItem("remember_login");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", initLayoutEnhancements);
