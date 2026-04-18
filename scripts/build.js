const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const outdir = path.join(__dirname, '..', 'dist');
const srcIndex = path.join(__dirname, '..', 'index.html');
const destIndex = path.join(outdir, 'index.html');
const srcIcons = path.join(__dirname, '..', 'src', 'icons');
const srcAssets = path.join(__dirname, '..', 'src', 'assets');
const destAssets = path.join(outdir, 'assets');
const srcSounds = path.join(__dirname, '..', 'src', 'sounds');
const destSounds = path.join(outdir, 'sounds');

// ensure outdir exists
if (!fs.existsSync(outdir)) fs.mkdirSync(outdir, { recursive: true });

// Copy static files
fs.copyFileSync(srcIndex, destIndex);

if (fs.existsSync(srcIcons)) {
  fs.readdirSync(srcIcons).forEach(file => {
    fs.copyFileSync(path.join(srcIcons, file), path.join(outdir, file));
  });
}

if (fs.existsSync(srcAssets)) {
  if (!fs.existsSync(destAssets)) fs.mkdirSync(destAssets, { recursive: true });
  fs.readdirSync(srcAssets).forEach(file => {
    fs.copyFileSync(path.join(srcAssets, file), path.join(destAssets, file));
  });
}

if (fs.existsSync(srcSounds)) {
  if (!fs.existsSync(destSounds)) fs.mkdirSync(destSounds, { recursive: true });
  fs.readdirSync(srcSounds).forEach(file => {
    fs.copyFileSync(path.join(srcSounds, file), path.join(destSounds, file));
  });
}

esbuild.build({
  entryPoints: [path.join(__dirname, '..', 'src', 'main.ts')],
  bundle: true,
  minify: true,
  sourcemap: false,
  outfile: path.join(outdir, 'bundle.js'),
  define: { 'process.env.NODE_ENV': '"production"' },
  loader: {
    '.ttf': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'dataurl'
  },
  assetNames: 'assets/[name]-[hash]',
}).then(() => {
  console.log('Build finished successfully');
}).catch(() => process.exit(1));
