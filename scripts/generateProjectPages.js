const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const articles = require(path.join(projectRoot, 'src', 'articles.json'));
const personalInfo = require(path.join(projectRoot, 'src', 'data.json')).personalInfo;
const hostname = fs.readFileSync(path.join(projectRoot, 'CNAME'), 'utf8').trim();
const siteUrl = `https://${hostname}`;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function getImagePath(image) {
  if (!image || typeof image.src !== 'string' || image.src.split('/').includes('..')) {
    throw new Error('Project image has an invalid source path');
  }

  const relativePath = image.src.replace(/^\/+/, '');
  const sourcePath = path.join(projectRoot, 'src', relativePath);
  if (!relativePath.startsWith('assets/') || !fs.existsSync(sourcePath)) {
    throw new Error(`Project image does not exist: ${image.src}`);
  }

  return `/${relativePath}`;
}

function renderFigure(image, className, loading = 'lazy') {
  const imagePath = getImagePath(image);
  const invertClass = image.shouldInvert ? ' invert-dark' : '';

  return `
    <figure class="${className}">
      <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(image.alt || image.title)}" class="${className === 'article-main-image' ? 'schematic-img' : ''}${invertClass}" loading="${loading}" decoding="async">
      <figcaption class="image-caption">${escapeHtml(image.caption || image.desc || image.title)}</figcaption>
    </figure>
  `;
}

function renderProject(article, allArticles) {
  if (!/^[a-z0-9-]+$/.test(article.id)) {
    throw new Error(`Project id is not a URL-safe slug: ${article.id}`);
  }

  const canonicalUrl = `${siteUrl}/projects/${article.id}/`;
  const mainImageUrl = `${siteUrl}${getImagePath(article.mainImage)}`;
  const leadSection = article.sections[0];
  if (!leadSection) throw new Error(`Project has no lead section: ${article.id}`);

  const pageData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonicalUrl}#article`,
    headline: article.title,
    alternativeHeadline: article.subtitle,
    description: article.description,
    image: mainImageUrl,
    author: {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: personalInfo.name,
      url: siteUrl,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    articleSection: article.sections.map(section => section.title),
    keywords: article.components,
    inLanguage: 'en',
  };
  const jsonLd = JSON.stringify(pageData, null, 2).replace(/</g, '\\u003c');

  const otherSections = article.sections.slice(1).map((section, index) => `
    <section>
      <h2 class="article-section-title">${escapeHtml(section.title)}</h2>
      <p>${escapeHtml(section.content)}</p>
      ${index === 0 && article.secondaryImage ? renderFigure(article.secondaryImage, 'article-inline-image') : ''}
    </section>
  `).join('');

  const components = article.components.map(component => `<li>${escapeHtml(component)}</li>`).join('');
  const gallery = article.gallery.map((image, index) => `
    <li class="gallery-index-item">
      <a class="gallery-index-link" href="${escapeHtml(getImagePath(image))}" aria-label="Open image: ${escapeHtml(image.title)}">
        <span class="gallery-index-number">${String(index + 1).padStart(2, '0')}</span>
        <span class="gallery-index-title">${escapeHtml(image.title)}</span>
      </a>
      <p class="gallery-index-description">${escapeHtml(image.desc)}</p>
    </li>
  `).join('');
  const relatedProjects = Object.values(allArticles)
    .filter(project => project.id !== article.id)
    .map(project => `<li><a href="/projects/${encodeURIComponent(project.id)}/">${escapeHtml(project.title)}</a></li>`)
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <base href="/">
  <title>${escapeHtml(article.title)} | ${escapeHtml(personalInfo.name)}</title>
  <meta name="description" content="${escapeHtml(article.description)}">
  <meta name="author" content="${escapeHtml(personalInfo.name)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:title" content="${escapeHtml(article.title)} | ${escapeHtml(personalInfo.name)}">
  <meta property="og:description" content="${escapeHtml(article.description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${mainImageUrl}">
  <meta property="og:image:alt" content="${escapeHtml(article.mainImage.alt)}">
  <meta property="og:site_name" content="${escapeHtml(personalInfo.name)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(article.title)} | ${escapeHtml(personalInfo.name)}">
  <meta name="twitter:description" content="${escapeHtml(article.description)}">
  <meta name="twitter:image" content="${mainImageUrl}">
  <meta name="twitter:image:alt" content="${escapeHtml(article.mainImage.alt)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/bundle.css">
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <main id="app">
    <article class="article-page static-project-page" itemscope itemtype="https://schema.org/Article" itemid="${canonicalUrl}#article">
      <div class="article-container">
        <nav class="article-nav" aria-label="Portfolio navigation">
          <a class="article-back-link" href="/">&lt;-- BACK TO HOME --&gt;</a>
        </nav>
        <header class="article-header">
          <h1 class="article-title" itemprop="headline">${escapeHtml(article.title)}</h1>
          <p class="article-subtitle">${escapeHtml(article.subtitle)}</p>
          <p class="static-project-summary" itemprop="description">${escapeHtml(article.description)}</p>
        </header>
        <div class="article-content">
          <div class="article-body">
            <div class="article-feature-row">
              ${renderFigure(article.mainImage, 'article-main-image', 'eager')}
              <p class="lead" itemprop="articleBody">${escapeHtml(leadSection.content)}</p>
              <section class="article-list-section intro-components" aria-labelledby="components-heading">
                <h2 class="list-title" id="components-heading">Core Components</h2>
                <ul class="newspaper-list">${components}</ul>
              </section>
            </div>
            <hr class="article-divider">
            <div class="article-columns">${otherSections}</div>
            <section class="project-gallery" aria-labelledby="gallery-heading">
              <header class="project-gallery-heading">
                <h2 id="gallery-heading">Project Gallery</h2>
                <span>${String(article.gallery.length).padStart(2, '0')} IMAGES / CLICK TO VIEW</span>
              </header>
              <ol class="gallery-index">${gallery}</ol>
            </section>
            <nav class="static-related-projects" aria-label="Other project case studies">
              <h2 class="article-section-title">More Projects</h2>
              <ul>${relatedProjects}</ul>
            </nav>
          </div>
        </div>
        <nav class="article-footer-links" aria-label="Professional profiles">
          <a class="link" href="https://github.com/stefanotamponi">GitHub</a>
          <a class="link" href="https://www.linkedin.com/in/stefano-tamponi-754868386">LinkedIn</a>
          <a class="link" href="/">Home</a>
        </nav>
      </div>
    </article>
  </main>
  <script type="module" src="/bundle.js"></script>
</body>
</html>
`;
}

module.exports = function generateProjectPages(outdir) {
  const projectList = Object.values(articles);
  const ids = new Set();

  for (const [key, article] of Object.entries(articles)) {
    if (article.id !== key || ids.has(article.id)) {
      throw new Error(`Project id must be unique and match its data key: ${key}`);
    }
    ids.add(article.id);

    const projectDir = path.join(outdir, 'projects', article.id);
    fs.mkdirSync(projectDir, { recursive: true });
    fs.writeFileSync(path.join(projectDir, 'index.html'), renderProject(article, articles));
  }

  const urls = [siteUrl, ...projectList.map(article => `${siteUrl}/projects/${article.id}/`)];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(outdir, 'sitemap.xml'), sitemap);
};