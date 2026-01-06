(function () {
  const GA_MEASUREMENT_ID = "G-966PVF5QC1";
  const STORAGE_KEY = "cookie_consent_v1";

  const bar = document.getElementById("cookiebar");
  const backdrop = document.getElementById("cookiebackdrop");
  const btnAccept = document.getElementById("cookieAccept");
  const btnReject = document.getElementById("cookieReject");

  const manageTriggers = [
    ...document.querySelectorAll(".cookie-manage"),
    ...document.querySelectorAll("#cookieManage"),
  ];

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  }

  function showBar() {
    if (bar) bar.hidden = false;
    if (backdrop) backdrop.hidden = false;
    document.body.classList.add("cookie-open");

    const focusTarget = bar?.querySelector(
      "button, a, input, [tabindex]:not([tabindex='-1'])"
    );
    focusTarget?.focus?.();
  }

  function hideBar() {
    if (bar) bar.hidden = true;
    if (backdrop) backdrop.hidden = true;
    document.body.classList.remove("cookie-open");
  }

  function deleteCookie(name) {
    const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
    const host = location.hostname;

    const parts = host.split(".");
    const rootDomain = parts.length >= 2 ? parts.slice(-2).join(".") : host;

    const variants = [
      `; Path=/`,
      `; Path=/; Domain=${host}`,
      `; Path=/; Domain=.${host}`,
      `; Path=/; Domain=${rootDomain}`,
      `; Path=/; Domain=.${rootDomain}`,
    ];

    for (const v of variants) {
      document.cookie = `${name}=; Expires=${expires}${v}; SameSite=Lax`;
      document.cookie = `${name}=; Expires=${expires}${v}`;
    }
  }

  function deleteGaCookies() {
    deleteCookie("_ga");
    deleteCookie("_gid");
    deleteCookie("_gat");

    const all = document.cookie ? document.cookie.split(";") : [];
    for (const c of all) {
      const [rawName] = c.split("=");
      const name = rawName ? rawName.trim() : "";
      if (name.startsWith("_ga_")) deleteCookie(name);
    }
  }

  function ensureGaLoaded() {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return;
    if (window.__ga_loaded) return;
    window.__ga_loaded = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      security_storage: "granted",
      wait_for_update: 500,
    });

    const s = document.createElement("script");
    s.async = true;
    s.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(s);

    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);
  }

  function setAnalyticsConsent(granted) {
    if (typeof window.gtag !== "function") return;
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
  }

  function applyConsent(consentValue) {
    if (consentValue === "accepted") {
      ensureGaLoaded();
      setAnalyticsConsent(true);
      hideBar();
      return;
    }

    if (consentValue === "rejected") {
      setAnalyticsConsent(false);

      deleteGaCookies();

      hideBar();
      return;
    }

    showBar();
  }

  function getStoredConsent() {
    return safeGet(STORAGE_KEY);
  }

  function setStoredConsent(value) {
    safeSet(STORAGE_KEY, value);
  }

  btnAccept?.addEventListener("click", () => {
    setStoredConsent("accepted");
    applyConsent("accepted");
  });

  btnReject?.addEventListener("click", () => {
    setStoredConsent("rejected");
    applyConsent("rejected");
  });

  manageTriggers.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showBar();
    });
  });

  // Init
  applyConsent(getStoredConsent());
})();