import { AppData } from '../types';
import { renderTextWithLinks } from './hero'; // Import renderTextWithLinks

export function handleSkillSeparators() {
  const skills = Array.from(document.querySelectorAll('.skills-line-item')) as HTMLElement[]
  
  if (skills.length === 0) return
  
  skills.forEach(skill => skill.classList.remove('end-of-line'))
  
  for (let i = 0; i < skills.length - 1; i++) {
    const currentSkill = skills[i]
    const nextSkill = skills[i + 1]
    
    const currentRect = currentSkill.getBoundingClientRect()
    const nextRect = nextSkill.getBoundingClientRect()
    
    if (Math.abs(currentRect.top - nextRect.top) > 8) {
      currentSkill.classList.add('end-of-line')
    }
  }
  
  skills[skills.length - 1].classList.add('end-of-line')
}



export function setupSkillInteractions(data: AppData) {
  const skills = Array.from(document.querySelectorAll('.skills-line-item')) as HTMLElement[]
  const bio = document.getElementById('bio-text') as HTMLElement
  const bioContent = document.getElementById('bio-content') as HTMLElement
  const originalBio = data.personalInfo.bio
  const displayName = document.querySelector('.display') as HTMLElement
  let animationTimeout: number;

  const handleSkillClick = (newContent: string) => {
    clearTimeout(animationTimeout);

    const existingSkeleton = bio.querySelector('.skeleton-container');
    if (existingSkeleton) {
      existingSkeleton.remove();
    }

    bioContent.innerHTML = '';

    if (newContent !== originalBio) {
      const backLink = document.createElement('button');
      backLink.type = 'button';
      backLink.className = 'back-link';
      backLink.textContent = '<--   CLICK TO GO BACK   -->';
      backLink.tabIndex = 0;
      backLink.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          resetBio();
        }
      });
      bioContent.appendChild(backLink);
    }

    const nodes = renderTextWithLinks(newContent);
    nodes.forEach(node => bioContent.appendChild(node));

    void bioContent.offsetHeight;

    const lineHeight = parseFloat(getComputedStyle(bioContent).lineHeight);
    const bioHeight = bioContent.offsetHeight;
    const numLines = Math.ceil(bioHeight / lineHeight);

    bio.classList.add('loading')
    const skeletonContainer = document.createElement('div')
    skeletonContainer.className = 'skeleton-container'
    bio.appendChild(skeletonContainer)

    for (let i = 0; i < numLines; i++) {
      const skeleton = document.createElement('div')
      skeleton.className = 'skeleton-loader';
      skeleton.style.animationDelay = `${(numLines - 1 - i) * 0.05}s`;
      skeletonContainer.appendChild(skeleton);
      void skeleton.offsetHeight;
    }

    bio.classList.add('loading-start')

    animationTimeout = setTimeout(() => {
      if (bio.contains(skeletonContainer)) {
        bio.removeChild(skeletonContainer)
      }
      bio.classList.remove('loading')
      bio.classList.remove('loading-start')
    }, 400 + numLines * 50)
  }

  skills.forEach(skill => {
    skill.tabIndex = 0;

    const activateSkill = (e: Event) => {
      if (skill.classList.contains('active')) {
        return;
      }
      e.stopPropagation();
      skills.forEach(s => s.classList.remove('active'));
      skill.classList.add('active');
      
      const skillName = skill.textContent!.trim();
      const desc = data.skillDescriptions[skillName] || originalBio;
      handleSkillClick(desc);
    };

    skill.addEventListener('click', activateSkill);

    skill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateSkill(e);
      }
    });
  })
  
  const resetBio = () => {
    const isActive = Array.from(skills).some(s => s.classList.contains('active'));
    if (isActive) {
      skills.forEach(s => s.classList.remove('active'))
      handleSkillClick(originalBio)
    }
  }

  bio?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('back-link')) {
      resetBio()
    }
  })

  displayName?.addEventListener('click', resetBio)
}
