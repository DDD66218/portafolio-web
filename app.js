const I18N = {
  es: {
    titulo: "Mis últimos trabajos",
    sub: "Una muestra de lo que puedo hacer. Entra a cada sitio, míralo y dime cuál quieres para tu negocio.",
    tarjetaLink: "Visitar sitio",
    ctaTitulo: "¿Quieres un sitio así para tu negocio?",
    ctaBtn: "Hablemos por WhatsApp",
    pageTitle: "Portafolio · Diseño Web",
    langBtn: "EN",
    langLabel: "Cambiar idioma a inglés",
    themeLight: "Cambiar a modo claro",
    themeDark: "Cambiar a modo oscuro"
  },
  en: {
    titulo: "My latest work",
    sub: "A sample of what I can build. Open each site, take a look and tell me which one fits your business.",
    tarjetaLink: "Visit site",
    ctaTitulo: "Want a site like this for your business?",
    ctaBtn: "Let's talk on WhatsApp",
    pageTitle: "Portfolio · Web Design",
    langBtn: "ES",
    langLabel: "Switch language to Spanish",
    themeLight: "Switch to light mode",
    themeDark: "Switch to dark mode"
  }
};

const grid = document.getElementById("proyectos");
const langToggle = document.getElementById("langToggle");
const themeToggle = document.getElementById("themeToggle");
const chrome = document.querySelector(".chrome");
const themeColor = document.querySelector("meta[name='theme-color']");

let lang = localStorage.getItem("lang");
if (!lang) lang = (navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en";

function renderCards() {
  grid.innerHTML = PROYECTOS.map((p) =>
    `<a class="card" href="${p.url}" target="_blank" rel="noopener noreferrer" aria-label="${p.titulo}">
      <div class="thumb"><img src="${p.img}" alt="${p.titulo}" loading="lazy"></div>
      <div class="card-body">
        <div class="card-row">
          <h2 class="card-title">${p.titulo}</h2>
          <span class="card-link" data-i18n="tarjetaLink"></span>
        </div>
        <p class="card-desc"></p>
      </div>
    </a>`
  ).join("");

  grid.querySelectorAll(".thumb img").forEach((img) => {
    img.addEventListener("error", () => {
      img.closest(".thumb").remove();
    });
  });
}

function applyLang(l) {
  lang = l;
  localStorage.setItem("lang", l);
  const t = I18N[l];

  document.documentElement.lang = l;
  document.title = t.pageTitle;
  langToggle.textContent = t.langBtn;
  langToggle.setAttribute("aria-label", t.langLabel);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t[el.dataset.i18n];
  });

  grid.querySelectorAll(".card-desc").forEach((el, i) => {
    el.textContent = PROYECTOS[i][l];
  });

  themeToggle.setAttribute("aria-label", currentTheme === "dark" ? t.themeLight : t.themeDark);
}

function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  themeColor.setAttribute("content", theme === "dark" ? "#000000" : "#F5F5F7");
  themeToggle.setAttribute("aria-label", I18N[lang][theme === "dark" ? "themeLight" : "themeDark"]);
  document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
}

let currentTheme = localStorage.getItem("theme");
if (!currentTheme) {
  currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

renderCards();
setTheme(currentTheme);
applyLang(lang);

langToggle.addEventListener("click", () => {
  applyLang(lang === "es" ? "en" : "es");
});

themeToggle.addEventListener("click", () => {
  setTheme(currentTheme === "dark" ? "light" : "dark");
});

addEventListener("scroll", () => {
  chrome.classList.toggle("scrolled", scrollY > 8);
}, { passive: true });

const waBtn = document.getElementById("waBtn");
waBtn.href = "https://wa.me/" + CONFIG.contacto.whatsapp;