type Theme = "system" | "light" | "dark";
const control = document.querySelector<HTMLElement>(".theme-control");
if (control) {
  const options = control.querySelectorAll<HTMLInputElement>(
    'input[name="theme"]',
  );
  const apply = (theme: Theme) => {
    document.documentElement.dataset.theme = theme;
    options.forEach((option) => {
      option.checked = option.value === theme;
    });
  };
  try {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved === "light" || saved === "dark") apply(saved);
  } catch {
    /* Storage is optional. */
  }
  // Keep arrow-key wrapping consistent across Chromium and Safari.
  control.addEventListener("keydown", (event) => {
    const directions: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };
    const step = directions[event.key];
    const index = Array.from(options).findIndex(
      (option) => option === event.target,
    );
    if (!step || index < 0) return;
    event.preventDefault();
    const next = options[(index + step + options.length) % options.length];
    next.focus();
    next.click();
  });
  control.hidden = false;
  control.addEventListener("change", (event) => {
    const option = event.target;
    if (!(option instanceof HTMLInputElement) || !option.checked) return;
    const theme = option.value;
    if (theme !== "system" && theme !== "light" && theme !== "dark") return;
    apply(theme);
    try {
      if (theme === "system") localStorage.removeItem("portfolio-theme");
      else localStorage.setItem("portfolio-theme", theme);
    } catch {
      /* This visit still uses the chosen theme. */
    }
  });
}
