const esbuild = require('esbuild')
const liveServer = require('live-server')
const path = require('path')

const outdir = path.join(__dirname, '..', 'dist')

const fs = require('fs')
const srcIndex = path.join(__dirname, '..', 'index.html')
const destIndex = path.join(outdir, 'index.html')
const srcStyles = path.join(__dirname, '..', 'src', 'styles.css')
const destStyles = path.join(outdir, 'styles.css')


// ensure outdir exists and copy static files
if (!fs.existsSync(outdir)) fs.mkdirSync(outdir, { recursive: true })
fs.copyFileSync(srcIndex, destIndex)
fs.copyFileSync(srcStyles, destStyles)

// Watch for changes to styles.css and copy to dist on change
fs.watch(srcStyles, { persistent: true }, (eventType) => {
  if (eventType === 'change') {
    fs.copyFileSync(srcStyles, destStyles)
    console.log('styles.css updated')
  }
})

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
