export const site = {
  title: "Isaac Velando — projects & experiments",
  description:
    "A collection of things I’ve made: mathematical art, literary explorations, useful tools, and an archived blog.",
  url: "https://isaacvelando.com/",
};
export type Artwork =
  "tangent" | "shelf" | "money" | "map" | "print" | "terminal";
export interface Project {
  name: string;
  category: string;
  description: string;
  url: string;
  art: Artwork;
}
// Curated at build time, never fetched at runtime. Sources: docs/content.md.
export const projects: readonly Project[] = [
  {
    name: "Tangent Garden",
    category: "Mathematical art",
    art: "tangent",
    description:
      "A notebook for the beauty hidden in geometry. Explore curves, light, and constructions in two, three, and four dimensions—and make a little mathematical art of your own.",
    url: "https://tangent-garden.isaacvelando.com/",
  },
  {
    name: "Shelf Life",
    category: "An experiment in scale",
    art: "shelf",
    description:
      "Step into a library of every possible book. Read, search, and try to comprehend its impossible scale. An interactive homage to A Short Stay in Hell and The Library of Babel.",
    url: "https://shelf-life.isaacvelando.com/",
  },
  {
    name: "moneypath",
    category: "A practical what-if",
    art: "money",
    description:
      "Sketch different financial futures and see how they unfold, month by month. Compare income, spending, loans, and investments in a simulator that keeps your data in your browser.",
    url: "https://moneypath.isaacvelando.com/",
  },
  {
    name: "Tom’s Crossing Map",
    category: "An unofficial fan atlas",
    art: "map",
    description:
      "A tabletop companion to Mark Z. Danielewski’s novel. Follow characters through an illustrated landscape and journal, revealing the story only as far as you’ve read.",
    url: "https://toms-crossing-map.isaacvelando.com/",
  },
  {
    name: "Household 3D",
    category: "Useful things, made physical",
    art: "print",
    description:
      "Small improvements for everyday life, designed and 3D printed. A collection of functional household objects, with the thinking, iterations, and lessons behind each design.",
    url: "https://www.household3d.com/",
  },
  {
    name: "grepLinux",
    category: "Archived blog · 2014",
    art: "terminal",
    description:
      "An earlier corner of the internet: writing about Linux, security, and privacy. Preserved as an archive of what I was learning and thinking about at the time.",
    url: "https://greplinux.com/",
  },
];
