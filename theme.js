  (function themeInit(){
    const KEY = "theme";
    const btn = document.getElementById("themeToggle");

    function apply(theme){
      document.documentElement.setAttribute("data-theme", theme);
      if (btn) btn.textContent = theme === "light" ? "☀️" : "🌙";
    }

    const saved = localStorage.getItem(KEY);
    const initial = saved === "light" || saved === "dark" ? saved : "dark";
    apply(initial);

    btn && btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "light" ? "dark" : "light";
      localStorage.setItem(KEY, next);
      apply(next);
    });
  })();
