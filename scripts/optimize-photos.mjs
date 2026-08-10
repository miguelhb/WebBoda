import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const photosPath = path.resolve("public/photos");
const maxSide = 2000;
const quality = 82;

const files = await fs.readdir(photosPath, { withFileTypes: true });
const imageFiles = files
  .filter((file) => file.isFile())
  .filter((file) => /\.(jpe?g|png)$/i.test(file.name));

const results = [];

for (const file of imageFiles) {
  const sourcePath = path.join(photosPath, file.name);
  const parsed = path.parse(file.name);
  const destinationName =
    parsed.ext.toLowerCase() === ".png" ? `${parsed.name}.jpg` : file.name;
  const destinationPath = path.join(photosPath, destinationName);
  const tempPath = `${destinationPath}.tmp`;

  const before = (await fs.stat(sourcePath)).size;

  await sharp(sourcePath)
    .rotate()
    .resize({
      width: maxSide,
      height: maxSide,
      fit: "inside",
      withoutEnlargement: true
    })
    .jpeg({
      quality,
      mozjpeg: true
    })
    .toFile(tempPath);

  await fs.rename(tempPath, destinationPath);

  if (destinationPath !== sourcePath) {
    await fs.rm(sourcePath);
  }

  const after = (await fs.stat(destinationPath)).size;
  results.push({
    file: destinationName,
    beforeKB: Math.round(before / 1024),
    afterKB: Math.round(after / 1024)
  });
}

console.table(results);
