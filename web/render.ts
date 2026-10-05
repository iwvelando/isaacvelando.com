import { projects, site } from "./projects.ts";
import { orbitArt, projectArt } from "./art.ts";
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function renderPage(template: string): string {
  const cards = projects
    .map(
      (p) =>
        `<article class="project project-${p.art}"><div class="project-art">${projectArt(p.art)}</div><div class="project-copy"><p class="category">${escape(p.category)}</p><h3><a href="${escape(p.url)}">${escape(p.name)}</a><span class="outbound" aria-hidden="true">↗</span></h3><p class="description">${escape(p.description)}</p></div></article>`,
    )
    .join("\n");
  return template
    .replaceAll("%%TITLE%%", escape(site.title))
    .replaceAll("%%DESCRIPTION%%", escape(site.description))
    .replace("%%PROJECTS%%", cards)
    .replace("%%ORBIT%%", orbitArt());
}
