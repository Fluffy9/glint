const { createRequire } = require("module");
const fs = require("fs");
const path = require("path");

const requireFromNext = createRequire(require.resolve("next/package.json"));
const sharp = requireFromNext("sharp");
const dir = path.join(__dirname, "../docs/readme");

(async () => {
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".png")) continue;
    const file = path.join(dir, name);
    const img = sharp(file);
    const meta = await img.metadata();
    const maxW = name.startsWith("packaging-") ? 720 : name === "hero.png" ? 1600 : 1400;
    const pipeline = meta.width > maxW ? img.resize({ width: maxW }) : img;
    const buf = await pipeline
      .png({ compressionLevel: 9, palette: true, quality: 80, effort: 10 })
      .toBuffer();
    fs.writeFileSync(file, buf);
    console.log(
      name,
      `${Math.round(buf.length / 1024)}K`,
      `${meta.width}->${meta.width > maxW ? maxW : meta.width}`,
    );
  }
})();
