import { AppData } from '../types';

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

export function createHero(data: AppData) {
  const el = document.createElement('section')
  el.className = 'hero reveal'
  
  const skillsHTML = data.skills
    .map(skill => `<button class="skills-line-item" type="button"><span>${skill}</span></button>`)
    .join('')
  
  const linksHTML = data.links
    .map(link => `<a class="link" href="${link.href}" aria-label="${link.ariaLabel}">${link.label}</a>`)
    .join('')
  
  el.innerHTML = `
    <div class="typography-card">
      <h1 class="display">${data.personalInfo.name}</h1>
      <p class="subtitle">${data.personalInfo.title} — ${data.personalInfo.location}</p>
      <div class="skills-line-separator">
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

  return el
}
