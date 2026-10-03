import { AppData, ArticlesData } from '../types';
import { createSkillMarqueeHTML } from './skillMarquee';

export function renderTextWithLinks(text: string): (Text | HTMLAnchorElement)[] {
  const nodes: (Text | HTMLAnchorElement)[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(document.createTextNode(text.substring(lastIndex, match.index)));
    }

    const link = document.createElement('a');
    link.textContent = match[1];
    link.href = match[2];
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    nodes.push(link);

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(document.createTextNode(text.substring(lastIndex)));
  }

  return nodes;
}

export function createHero(data: AppData, articles: ArticlesData) {
  const el = document.createElement('section')
  el.className = 'hero reveal'
  
  const skillsHTML = data.skills
    .map(skill => `<button class="skills-line-item" type="button"><span>${skill}</span></button>`)
    .join('')

  const linksHTML = data.links
    .map(link => `<a class="link" href="${link.href}" aria-label="${link.ariaLabel}">${link.label}</a>`)
    .join('')

  const articlesList = Object.values(articles);
  const firstArticle = articlesList[0];
  const restArticles = articlesList.slice(1);

  const featuredArticlesHTML = `
    <button class="featured-project-box" type="button" id="nav-${firstArticle.id}">
      <h2 class="featured-title">${firstArticle.title}</h2>
      <p class="featured-desc">${firstArticle.description} <span class="read-more">View project →</span></p>
    </button>
  `;

  let moreProjectsHTML = '';
  if (restArticles.length > 0) {
    const otherProjectsItems = restArticles.map(article => `
      <button class="index-link" type="button" id="nav-${article.id}">
        ${article.title}
      </button>
    `).join('<span style="margin: 0 8px; opacity: 0.5;">·</span>');

    moreProjectsHTML = `
      <div class="previous-projects-index">
        <span class="index-label">Previous project${restArticles.length > 1 ? 's' : ''}:</span>
        ${otherProjectsItems}
      </div>
    `;
  }
  
  el.innerHTML = `
    <div class="typography-card">
      <h1 class="display">${data.personalInfo.name}</h1>
      <p class="subtitle">${data.personalInfo.title} — ${data.personalInfo.location}</p>
      ${createSkillMarqueeHTML(data)}

      <div class="featured-project-container">
        <span class="featured-label">Latest Project</span>
        <div class="featured-project-list">
          ${featuredArticlesHTML}
        </div>
        ${moreProjectsHTML}
      </div>

      <div class="skills-line-separator">
        <span class="skills-index-label-inline">Click for Details</span>
        ${skillsHTML}
      </div>
      <div class="bio" id="bio-text"><div id="bio-content" aria-live="polite"></div></div>
      <div class="links">
        ${linksHTML}
      </div>
    </div>
  `

  const bioContent = el.querySelector('#bio-content') as HTMLElement;
  const bioNodes = renderTextWithLinks(data.personalInfo.bio);
  bioNodes.forEach(node => bioContent.appendChild(node));

  // Add listener for the new project button
  articlesList.forEach(article => {
    el.querySelector(`#nav-${article.id}`)?.addEventListener('click', () => {
      window.location.hash = `#${article.id}`;
    });
  });

  return el
}
