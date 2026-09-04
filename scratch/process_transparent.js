import sharp from 'sharp';
import fs from 'fs';
import path from 'path';


const brainDir = 'C:/Users/glenn/.gemini/antigravity-ide/brain/44754fca-7075-45ae-8b59-fa7699d33570';
const destDir = 'd:/PROJECTS/PithQuest/public/assets';

async function makeBorderTransparent(inputPath, outputPath, threshold = 238) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // Get raw RGBA buffer
  const rawBuffer = await image.ensureAlpha().raw().toBuffer();

  // Flood fill from all 4 corners and borders
  const visited = new Uint8Array(width * height);
  const queue = [];

  function isWhite(x, y) {
    const idx = (y * width + x) * 4;
    const r = rawBuffer[idx];
    const g = rawBuffer[idx + 1];
    const b = rawBuffer[idx + 2];
    return r >= threshold && g >= threshold && b >= threshold;
  }

  // Push all border pixels that are near-white
  for (let x = 0; x < width; x++) {
    if (isWhite(x, 0)) { queue.push(x, 0); visited[0 * width + x] = 1; }
    if (isWhite(x, height - 1)) { queue.push(x, height - 1); visited[(height - 1) * width + x] = 1; }
  }
  for (let y = 0; y < height; y++) {
    if (isWhite(0, y)) { queue.push(0, y); visited[y * width + 0] = 1; }
    if (isWhite(width - 1, y)) { queue.push(width - 1, y); visited[y * width + (width - 1)] = 1; }
  }

  // Breadth-first search to flood fill outer white background
  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];

    // Set alpha to 0 for this pixel
    const pixelIdx = (y * width + x) * 4;
    rawBuffer[pixelIdx + 3] = 0; // Alpha = 0

    // Neighbors
    const neighbors = [
      [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nPos = ny * width + nx;
        if (!visited[nPos] && isWhite(nx, ny)) {
          visited[nPos] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  // Save as PNG
  await sharp(rawBuffer, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 8 })
    .toFile(outputPath);

  console.log('Processed transparent PNG:', path.basename(outputPath));
}

async function run() {
  const tasks = [
    { in: 'wooden_cutting_board_1788506045730.jpg', out: 'cutting_board.png', thresh: 240 },
    { in: 'icon_coconut_pith_1788504175565.jpg', out: 'icon_coconut_pith.png', thresh: 240 },
    { in: 'icon_chef_knife_1788506064046.jpg', out: 'icon_chef_knife.png', thresh: 240 },
    { in: 'icon_prep_bowl_1788506090637.jpg', out: 'icon_prep_bowl.png', thresh: 240 },
    { in: 'icon_sliced_ubod_1788506109126.jpg', out: 'icon_sliced_ubod.png', thresh: 240 },
    { in: 'icon_seasonings_1788504243735.jpg', out: 'icon_seasonings.png', thresh: 240 },
    { in: 'icon_tapioca_starch_1788504203110.jpg', out: 'icon_tapioca_starch.png', thresh: 240 },
  ];

  for (const t of tasks) {
    const inputPath = path.join(brainDir, t.in);
    const outputPath = path.join(destDir, t.out);
    if (fs.existsSync(inputPath)) {
      await makeBorderTransparent(inputPath, outputPath, t.thresh);
    } else {
      console.warn('File not found:', inputPath);
    }
  }
}

run().catch(console.error);
