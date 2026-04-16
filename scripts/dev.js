const esbuild = require('esbuild')
const liveServer = require('live-server')
const path = require('path')

const outdir = path.join(__dirname, '..', 'dist')

const fs = require('fs')
const srcIndex = path.join(__dirname, '..', 'index.html')
const destIndex = path.join(outdir, 'index.html')
const srcStyles = path.join(__dirname, '..', 'src', 'styles.css')
const destStyles = path.join(outdir, 'styles.css')
const srcCssDir = path.join(__dirname, '..', 'src', 'css')
const destCssDir = path.join(outdir, 'css')
const srcAssets = path.join(__dirname, '..', 'src', 'assets')
const destAssets = path.join(outdir, 'assets')


// ensure outdir exists and copy static files
if (!fs.existsSync(outdir)) fs.mkdirSync(outdir, { recursive: true })
fs.copyFileSync(srcIndex, destIndex)
fs.copyFileSync(srcStyles, destStyles)

function copyCssDir() {
  if (fs.existsSync(srcCssDir)) {
    if (!fs.existsSync(destCssDir)) fs.mkdirSync(destCssDir, { recursive: true })
    fs.readdirSync(srcCssDir).forEach(file => {
      fs.copyFileSync(path.join(srcCssDir, file), path.join(destCssDir, file))
    })
    console.log('CSS directory updated')
  }
}

copyCssDir()

if (fs.existsSync(srcAssets)) {
  if (!fs.existsSync(destAssets)) fs.mkdirSync(destAssets, { recursive: true })
  fs.readdirSync(srcAssets).forEach(file => {
    fs.copyFileSync(path.join(srcAssets, file), path.join(destAssets, file))
  })
}

// Watch for changes to styles.css and copy to dist on change
fs.watch(srcStyles, { persistent: true }, (eventType) => {
  if (eventType === 'change') {
    fs.copyFileSync(srcStyles, destStyles)
    console.log('styles.css updated')
  }
})

// Watch CSS directory
if (fs.existsSync(srcCssDir)) {
  fs.watch(srcCssDir, { persistent: true, recursive: true }, (eventType) => {
    copyCssDir()
  })
}

;(async () => {
  try {
    const ctx = await esbuild.context({
      entryPoints: [path.join(__dirname, '..', 'src', 'main.ts')],
      bundle: true,
      sourcemap: true,
      outfile: path.join(outdir, 'bundle.js'),
      define: { 'process.env.NODE_ENV': '"development"' },
      loader: {
        '.ttf': 'file',
        '.woff': 'file',
        '.woff2': 'file'
      },
      assetNames: 'fonts/[name]',
    })
    await ctx.watch()
  // rebuild will update bundle.js; keep static files copied on start
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()

liveServer.start({
  root: 'dist',
  open: true,
  file: 'index.html',
  wait: 100
})
