type Theme = "system" | "light" | "dark";
const select = document.querySelector<HTMLSelectElement>("#theme");
if (select) {
  const apply = (theme: Theme) => {
    document.documentElement.dataset.theme = theme;
    select.value = theme;
  };
  try {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved === "light" || saved === "dark") apply(saved);
  } catch {
    /* Storage is optional. */
  }
  select.closest<HTMLElement>(".theme-control")!.hidden = false;
  select.addEventListener("change", () => {
    const theme = select.value as Theme;
    apply(theme);
    try {
      if (theme === "system") localStorage.removeItem("portfolio-theme");
      else localStorage.setItem("portfolio-theme", theme);
    } catch {
      /* This visit still uses the chosen theme. */
    }
  });
}
