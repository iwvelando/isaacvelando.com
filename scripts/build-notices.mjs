import { copyFile, writeFile } from "node:fs/promises";
await copyFile("LICENSE", "public/LICENSE.txt");
await writeFile(
  "public/THIRD-PARTY-NOTICES.txt",
  "This site ships no third-party runtime libraries or font files. Its illustrations and browser script are original. Build tools are development dependencies; their licenses accompany their npm packages.\n",
);
