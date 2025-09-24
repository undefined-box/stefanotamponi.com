const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const outdir = path.join(__dirname, '..', 'dist');
const srcIndex = path.join(__dirname, '..', 'index.html');
const destIndex = path.join(outdir, 'index.html');
const srcStyles = path.join(__dirname, '..', 'src', 'styles.css');
const destStyles = path.join(outdir, 'styles.css');
const srcSounds = path.join(__dirname, '..', 'src', 'sounds');
const destSounds = path.join(outdir, 'sounds');
const srcIcons = path.join(__dirname, '..', 'src', 'icons');

// ensure outdir exists and copy static files
if (!fs.existsSync(outdir)) fs.mkdirSync(outdir, { recursive: true });
fs.copyFileSync(srcIndex, destIndex);
fs.copyFileSync(srcStyles, destStyles);
if (fs.existsSync(srcSounds)) {
  if (!fs.existsSync(destSounds)) fs.mkdirSync(destSounds, { recursive: true });
  fs.readdirSync(srcSounds).forEach(file => {
    fs.copyFileSync(path.join(srcSounds, file), path.join(destSounds, file));
  });
}
if (fs.existsSync(srcIcons)) {
  fs.readdirSync(srcIcons).forEach(file => {
    fs.copyFileSync(path.join(srcIcons, file), path.join(outdir, file));
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
    '.woff2': 'file'
  },
  assetNames: 'fonts/[name]',
}).catch(() => process.exit(1));
