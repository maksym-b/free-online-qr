(function i18nInit() {
  const DEFAULT_LANG = "en";
  const SUPPORTED = new Set(["en", "nl"]);
  const STORAGE_KEY = "lang";

  const cache = new Map();

  async function loadDict(lang) {
    if (cache.has(lang)) return cache.get(lang);

    const url = `/i18n/${lang}.json`;
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error(`Cannot load ${url} (HTTP ${res.status})`);

    const dict = await res.json();
    cache.set(lang, dict);
    return dict;
  }

  function t(key, dict, fallback) {
    return (dict && dict[key]) || (fallback && fallback[key]) || "";
  }

  function apply(dict, fallback) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key, dict, fallback);
      if (val) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const spec = el.getAttribute("data-i18n-attr");
      if (!spec) return;

      spec.split(",").map(s => s.trim()).forEach((pair) => {
        const [attr, key] = pair.split(":").map(s => s.trim());
        if (!attr || !key) return;

        const val = t(key, dict, fallback);
        if (val) el.setAttribute(attr, val);
      });
    });

    const titleEl = document.querySelector("title");
    const titleKey = titleEl ? titleEl.getAttribute("data-i18n") : null;
    if (titleKey) {
      const val = t(titleKey, dict, fallback);
      if (val) document.title = val;
    }
  }

  function syncActiveLang(lang) {
    document.querySelectorAll(".lang-inline").forEach((el) => {
      el.dataset.active = lang;
    });

    document.querySelectorAll(".lang-inline [data-lang]").forEach((btn) => {
      const isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", isActive);
      if (btn.tagName === "BUTTON") {
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      }
    });
  }

  async function setLanguage(lang) {
    const safe = SUPPORTED.has(lang) ? lang : DEFAULT_LANG;

    try {
      const [enDict, langDict] = await Promise.all([
        loadDict(DEFAULT_LANG),
        safe === DEFAULT_LANG ? Promise.resolve(null) : loadDict(safe),
      ]);

      apply(langDict, enDict);

      window.__i18n = {
        lang: safe,
        dict: langDict,
        fallback: enDict,
        t: (key) => t(key, langDict, enDict),
      };
      window.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang: safe } }));

      localStorage.setItem(STORAGE_KEY, safe);
      document.documentElement.setAttribute("lang", safe);
      syncActiveLang(safe);
    } catch (err) {
      console.error("[i18n] Failed to set language:", safe, err);
    }
  }

  function getInitialLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.has(saved)) return saved;
    return DEFAULT_LANG;
  }

  window.i18n = { setLanguage, getInitialLang };

  document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (e) => {
      const el = e.target.closest(".lang-inline [data-lang]");
      if (!el) return;

      const lang = el.getAttribute("data-lang");
      setLanguage(lang);
    });

    setLanguage(getInitialLang());
  });
})();