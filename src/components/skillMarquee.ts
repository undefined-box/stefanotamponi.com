import { AppData } from '../types';

export function createSkillMarqueeHTML(data: AppData): string {
  const allSkillItems = Array.from(new Set(data.skillGroups.flatMap(group => group.items || [])));
  const skillMarqueeItemsHTML = allSkillItems
    .map(item => `<span class="skill-marquee-item" role="listitem">${item}</span>`)
    .join('');

  return `
    <div class="skill-marquee">
      <div class="skill-marquee-track">
        <div class="skill-marquee-group" role="list" aria-label="Skills and technologies">
          ${skillMarqueeItemsHTML}
        </div>
        <div class="skill-marquee-group" aria-hidden="true">
          ${skillMarqueeItemsHTML}
        </div>
      </div>
    </div>
  `;
}