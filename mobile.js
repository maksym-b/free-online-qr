/* =========================
   Mobile nav behavior (fullscreen menu)
   ========================= */
(function initMobileNav(){
  const details = document.getElementById("mobileNav");
  if (!details) return;

  const panel = details.querySelector(".topnav__panel");
  const closeBtn = details.querySelector(".topnav__close");
  const links = panel ? Array.from(panel.querySelectorAll("a")) : [];

  function close(){
    details.open = false;
  }

  details.addEventListener("toggle", () => {
    document.body.classList.toggle("nav-open", details.open);
  });

  closeBtn && closeBtn.addEventListener("click", close);
  links.forEach(a => a.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && details.open) close();
  });
})();
