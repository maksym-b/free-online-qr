(function themeInit(){
  const KEY = "theme";

  function apply(theme){
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll("#themeToggle, [data-theme-toggle]").forEach((btn) => {
      btn.textContent = theme === "light" ? "☀️" : "🌙";
    });
  }

  const saved = localStorage.getItem(KEY);
  const initial = saved === "light" || saved === "dark" ? saved : "dark";
  apply(initial);

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#themeToggle, [data-theme-toggle]");
    if (!btn) return;

    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    localStorage.setItem(KEY, next);
    apply(next);
  });
})();