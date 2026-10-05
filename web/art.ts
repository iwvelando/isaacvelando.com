import type { Artwork } from "./projects.ts";
// Original decorative SVG studies, not output from the linked tools.
const point = (x: number, y: number) => `${x.toFixed(2)},${y.toFixed(2)}`;
function path(fn: (t: number) => [number, number], steps = 200) {
  return Array.from(
    { length: steps + 1 },
    (_, i) => `${i ? "L" : "M"}${point(...fn((i / steps) * Math.PI * 2))}`,
  ).join(" ");
}
const line = (x1: number, y1: number, x2: number, y2: number) =>
  `<path d="M${point(x1, y1)} L${point(x2, y2)}"/>`;
const wrap = (body: string, box = "0 0 560 300") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" fill="none" aria-hidden="true" focusable="false">${body}</svg>`;
export function orbitArt() {
  const curves = Array.from({ length: 29 }, (_, i) => {
    const a = (i * Math.PI) / 29;
    return `<ellipse cx="200" cy="180" rx="144" ry="53" transform="rotate(${(a * 180) / Math.PI} 200 180)"/>`;
  }).join("");
  return wrap(
    `<g stroke="currentColor" stroke-width=".75" opacity=".7">${curves}</g><circle cx="200" cy="180" r="3" fill="currentColor"/>`,
    "0 0 400 360",
  );
}
export function projectArt(kind: Artwork): string {
  switch (kind) {
    case "tangent": {
      const normals = Array.from({ length: 58 }, (_, i) => {
        const t = (i * Math.PI * 2) / 58;
        return line(
          280 + 116 * Math.cos(t),
          150 + 98 * Math.sin(t),
          280 - 64 * Math.cos(t),
          150 - 116 * Math.sin(t),
        );
      }).join("");
      return wrap(
        `<g stroke="currentColor" stroke-width=".7" opacity=".32">${normals}</g><ellipse cx="280" cy="150" rx="116" ry="98" stroke="currentColor" stroke-width="1.7"/><path d="${path((t) => [280 + 165 * Math.cos(t) ** 3, 150 + 96 * Math.sin(t) ** 3])}" stroke="currentColor" stroke-width="2"/>`,
      );
    }
    case "shelf": {
      const rings = Array.from({ length: 20 }, (_, i) => {
        const r = 138 * 0.84 ** i;
        const points = Array.from({ length: 6 }, (_, j) =>
          point(
            280 + r * Math.cos((j * Math.PI) / 3),
            150 + r * Math.sin((j * Math.PI) / 3),
          ),
        );
        return `<polygon points="${points.join(" ")}" opacity="${0.2 + 0.7 * (1 - i / 20)}"/>`;
      }).join("");
      const rays = Array.from({ length: 6 }, (_, j) =>
        line(
          280,
          150,
          280 + 138 * Math.cos((j * Math.PI) / 3),
          150 + 138 * Math.sin((j * Math.PI) / 3),
        ),
      ).join("");
      return wrap(
        `<g stroke="currentColor" stroke-width="1">${rings}<g opacity=".25">${rays}</g></g>`,
      );
    }
    case "money":
      return wrap(
        `<g stroke="currentColor" stroke-width=".6" opacity=".14">${[65, 110, 155, 200, 245].map((y) => line(60, y, 500, y)).join("")}${[85, 163, 241, 319, 397, 475].map((x) => line(x, 45, x, 250)).join("")}</g><g stroke="currentColor" stroke-width="2.4"><path d="M65 240 C130 225 148 228 193 188 S274 187 315 145 S387 164 493 56"/><path opacity=".42" d="M65 240 C130 225 148 228 193 188 S274 205 315 177 S390 192 493 123"/><path opacity=".35" stroke-dasharray="5 6" d="M65 240 C130 225 148 228 193 188 S274 227 315 212 S390 217 493 199"/></g><circle cx="193" cy="188" r="5" fill="currentColor"/><circle cx="493" cy="56" r="5" fill="currentColor"/>`,
      );
    case "map": {
      const contours = [
        [200, 128, 110, 72],
        [386, 205, 90, 49],
      ]
        .map(([x, y, rx, ry]) =>
          Array.from(
            { length: 8 },
            (_, i) =>
              `<path d="${path((t) => [x + (rx - i * 11) * Math.cos(t) * (1 + 0.1 * Math.sin(3 * t)), y + (ry - i * 6) * Math.sin(t) * (1 + 0.14 * Math.cos(2 * t))])}" opacity="${0.25 + i * 0.075}"/>`,
          ).join(""),
        )
        .join("");
      return wrap(
        `<g stroke="currentColor" stroke-width="1.1">${contours}<path d="M346 22 C270 70 360 130 285 169 S269 242 217 288" stroke-width="2" opacity=".65"/><path d="M125 234 Q200 200 233 192 T355 98" stroke-dasharray="4 6" opacity=".5"/></g><g fill="currentColor"><circle cx="125" cy="234" r="4"/><circle cx="355" cy="98" r="4"/></g>`,
      );
    }
    case "print": {
      const layers = Array.from(
        { length: 18 },
        (_, i) =>
          `<ellipse cx="280" cy="${105 + i * 5}" rx="94" ry="35" opacity="${i === 0 ? 1 : 0.35}"/>`,
      ).join("");
      return wrap(
        `<g stroke="currentColor" stroke-width="1">${layers}<ellipse cx="280" cy="105" rx="76" ry="25"/><path d="M186 105 V190 M374 105 V190"/><path d="M373 125 C452 102 452 197 374 181" stroke-width="2"/><path d="M374 136 C434 117 434 182 374 169"/><path d="M155 240 H410 M170 234 V246 M394 234 V246 M138 88 V211 M132 100 H144 M132 199 H144" opacity=".4"/></g>`,
      );
    }
    case "terminal":
      return wrap(
        `<rect x="105" y="48" width="350" height="204" rx="5" stroke="currentColor" opacity=".4"/><path d="M105 80 H455" stroke="currentColor" opacity=".25"/><g fill="currentColor" opacity=".45"><circle cx="122" cy="64" r="2.5"/><circle cx="133" cy="64" r="2.5"/><circle cx="144" cy="64" r="2.5"/></g><path d="M138 113 L150 123 L138 133 M164 133 H180" stroke="currentColor" stroke-width="2"/><g stroke="currentColor" stroke-width="2" opacity=".3"><path d="M138 161 H355 M138 178 H406 M138 195 H322 M138 212 H370"/></g>`,
      );
  }
}
