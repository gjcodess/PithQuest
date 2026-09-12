const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const srcFiles = getFiles(path.resolve(__dirname, '../src'));
const regex = /['"]\/assets\/([^'"]+)['"]/g;
const missing = [];
const publicAssets = fs.readdirSync(path.resolve(__dirname, '../public/assets'));

srcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const assetName = match[1].split('?')[0].split('#')[0];
    const assetPath = path.resolve(__dirname, '../public/assets', assetName);
    if (!fs.existsSync(assetPath)) {
      const closest = publicAssets.filter(a => a.toLowerCase().includes(assetName.replace(/\.[^.]+$/, '').toLowerCase()) || assetName.toLowerCase().includes(a.replace(/\.[^.]+$/, '').toLowerCase()));
      missing.push({
        file: path.relative(path.resolve(__dirname, '..'), file),
        asset: assetName,
        possibleMatches: closest
      });
    }
  }
});

console.log('TOTAL MISSING ASSETS:', missing.length);
console.log(JSON.stringify(missing, null, 2));
