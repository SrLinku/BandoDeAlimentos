// validation.js

(function () {
  // Fallback simples caso alertBox não exista
  if (typeof window.alertBox !== "function") {
    window.alertBox = function (type, msg) {
      const el = document.createElement("div");
      el.className = "alert " + (type || "error");
      el.style.cssText = `
        position: fixed; top: 16px; right: 16px; z-index: 9999;
        background:#1f2937; color:#fff; padding:10px 14px; border-radius:8px;
        box-shadow:0 6px 18px rgba(0,0,0,.18); font: 500 14px/1.2 system-ui, sans-serif;
        max-width: 360px
      `;
      el.textContent = msg;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2800);
    };
  }

  // Helpers de validação
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const FONE_RE = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/; // (43) 99999-9999
  const CNPJ_RE = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/; // 00.000.000/0000-00
  const CPF_RE = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/; // 000.000.000-00

  function isEmpty(v) {
    return v == null || String(v).trim() === "";
  }

  function isEmail(v) {
    return EMAIL_RE.test(String(v).trim());
  }

  function isPhone(v) {
    return FONE_RE.test(String(v).trim());
  }

  function isCPF(v) {
    return CPF_RE.test(String(v).trim());
  }

  function isCNPJ(v) {
    return CNPJ_RE.test(String(v).trim());
  }

  function isCPFOrCNPJ(v) {
    const s = String(v).trim();
    return isCPF(s) || isCNPJ(s);
  }

  function isPositiveNumber(v) {
    const n = Number(v);
    return !isNaN(n) && n > 0;
  }

  function validateFormByAttributes(form) {
    const req = form.querySelectorAll("[required]");
    for (const el of req) {
      if (isEmpty(el.value)) {
        el.focus();
        alertBox("error", `Preencha o campo: ${getLabel(el)}`);
        return false;
      }
    }

    const emails = form.querySelectorAll('input[type="email"]');
    for (const el of emails) {
      if (!isEmpty(el.value) && !isEmail(el.value)) {
        el.focus();
        alertBox("error", `E-mail inválido em: ${getLabel(el)}`);
        return false;
      }
    }
    return true;
  }

  function getLabel(el) {
    const id = el.getAttribute("id");
    if (id) {
      const label = el.form?.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent.trim();
    }

    const lbl = el.closest("label");
    if (lbl) return lbl.textContent.trim();

    return el.getAttribute("placeholder") || el.name || "campo";
  }

  // Login
  function validateLogin() {
    const form = document.querySelector('form[data-form="login"]');
    if (!form) return true;
    const email = form.querySelector("#email");
    const senha = form.querySelector("#senha");
    if (isEmpty(email.value) || !isEmail(email.value)) {
      email.focus();
      alertBox("error", "Informe um e-mail válido.");
      return false;
    }
    return true;
  }

  // Doadores
  function validateDoadorForm() {
    const form = document.querySelector('form[data-form="doador"]');
    if (!form) return true;
    if (!validateFormByAttributes(form)) return false;

    const doc = form.querySelector("#d_documento");
    const email = form.querySelector("#d_email");
    const tel = form.querySelector("#d_telefone");

    if (!isEmpty(doc.value) && !isCPFOrCNPJ(doc.value)) {
      doc.focus();
      alertBox("error", "Documento inválido (CPF ou CNPJ).");
      return false;
    }
    if (!isEmpty(email.value) && !isEmail(email.value)) {
      email.focus();
      alertBox("error", "E-mail do doador inválido.");
      return false;
    }
    if (!isEmpty(tel.value) && !isPhone(tel.value)) {
      tel.focus();
      alertBox("error", "Telefone inválido. Ex.: (43) 99999-9999");
      return false;
    }
    return true;
  }

  // Instituições
  function validateInstituicaoForm() {
    const form = document.querySelector('form[data-form="instituicao"]');
    if (!form) return true;
    if (!validateFormByAttributes(form)) return false;

    const cnpj = form.querySelector("#i_cnpj");
    const email = form.querySelector("#i_email");
    const tel = form.querySelector("#i_telefone");

    if (!isEmpty(cnpj.value) && !isCNPJ(cnpj.value)) {
      cnpj.focus();
      alertBox("error", "CNPJ inválido.");
      return false;
    }
    if (!isEmpty(email.value) && !isEmail(email.value)) {
      email.focus();
      alertBox("error", "E-mail da instituição inválido.");
      return false;
    }
    if (!isEmpty(tel.value) && !isPhone(tel.value)) {
      tel.focus();
      alertBox("error", "Telefone inválido. Ex.: (43) 3333-0000 ou (43) 99999-9999");
      return false;
    }
    return true;
  }

  // Doações
  function validateDonationBeforeSubmit() {
    const doadorSel = document.getElementById("doadorSel");
    if (doadorSel && isEmpty(doadorSel.value)) {
      doadorSel.focus();
      alertBox("error", "Selecione o doador.");
      return false;
    }
    const linhas = Array.from(document.querySelectorAll("#itensTab tr")).slice(1);
    if (linhas.length === 0) {
      alertBox("error", "Inclua pelo menos um item na doação.");
      return false;
    }
    for (const tr of linhas) {
      const item = tr.querySelector(".it_item");
      const qtd = tr.querySelector(".it_qtd");
      const uni = tr.querySelector(".it_uni");
      if (!item || isEmpty(item.value)) {
        alertBox("error", "Há item sem seleção.");
        return false;
      }
      if (!qtd || !isPositiveNumber(qtd.value)) {
        qtd?.focus();
        alertBox("error", "Quantidade deve ser maior que 0.");
        return false;
      }
      if (!uni || isEmpty(uni.value)) {
        alertBox("error", "Selecione a unidade.");
        return false;
      }
    }
    return true;
  }

  // Estoque
  function validateEstoqueFiltro() {
    const grid = document.getElementById("grid");
    if (!grid) return true;

    return true;
  }

  window.attachValidations = function () {
    // Login
    const frmLogin = document.querySelector('form[data-form="login"]');
    if (frmLogin) {
      frmLogin.addEventListener("submit", (e) => {
        if (!validateLogin()) e.preventDefault();
      });
    }

    // Doadores
    const frmDoador = document.querySelector('form[data-form="doador"]');
    if (frmDoador) {
      frmDoador.addEventListener("submit", (e) => {
        if (!validateDoadorForm()) e.preventDefault();
      });
    }

    // Instituições
    const frmInst = document.querySelector('form[data-form="instituicao"]');
    if (frmInst) {
      frmInst.addEventListener("submit", (e) => {
        if (!validateInstituicaoForm()) e.preventDefault();
      });
    }

    // Doações
    const btnSalvarDoacao = document.querySelector('button[data-action="salvarDoacao"]');
    if (btnSalvarDoacao) {
      btnSalvarDoacao.addEventListener(
        "click",
        (e) => {
          if (!validateDonationBeforeSubmit()) e.stopImmediatePropagation();
        },
        true
      );
    }

    validateEstoqueFiltro();
  };

  function applyMasks() {
    const maskPhone = (value) => {
      return value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d{4})$/, "$1-$2")
        .substring(0, 15);
    };

    const maskCNPJ = (value) => {
      return value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .substring(0, 18);
    };

    const maskEmail = (value) => value.trim().toLowerCase();

    document.querySelectorAll("#i_telefone, #d_telefone").forEach((input) => {
      input.addEventListener("input", (e) => {
        e.target.value = maskPhone(e.target.value);
      });
    });

    document.querySelectorAll("#i_cnpj, #d_documento").forEach((input) => {
      input.addEventListener("input", (e) => {
        e.target.value = maskCNPJ(e.target.value);
      });
    });

    document.querySelectorAll("#i_email, #d_email").forEach((input) => {
      input.addEventListener("blur", (e) => {
        e.target.value = maskEmail(e.target.value);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", applyMasks);
})();
