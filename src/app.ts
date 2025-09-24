import data from './data.json'
import { AppData } from './types'
import { createHero } from './components/hero'
import { setupSkillInteractions, handleSkillSeparators } from './components/skillInteractions'
import { ThemeManager } from './utils/themeManager'
import { setupResumeButton } from './utils/musicPlayer'
import { calculateAndSetBioMinHeight } from './utils/bioHeightCalculator'

// Main Application
export class App {
  private data: AppData
  private themeManager: ThemeManager

  constructor() {
    this.data = data as AppData
    this.themeManager = new ThemeManager(this.data.theme.toggleLabels.light, this.data.theme.toggleLabels.dark)
  }

  public mount(): void {
    const app = document.getElementById('app')!
    app.appendChild(createHero(this.data))
    this.themeManager.mount()
    // Update page title
    const titleElement = document.getElementById('page-title')
    if (titleElement) {
      titleElement.textContent = this.data.personalInfo.name
    }
    
    // Setup skill interactions
    setupSkillInteractions(this.data)

    // Calculate and set initial min-height for bio
    const bioElement = document.getElementById('bio-text') as HTMLElement;
    if (bioElement) {
      calculateAndSetBioMinHeight(this.data, bioElement);
    }
    
    // Handle skill separators after layout is settled
    document.fonts.ready.then(() => {
      handleSkillSeparators();
    });
    
    // Handle resize events
    let resizeTimeout: number;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeTimeout);
      resizeTimeout = requestAnimationFrame(() => {
        handleSkillSeparators();
        if (bioElement) {
          calculateAndSetBioMinHeight(this.data, bioElement);
        }
      });
    });

    setupResumeButton();
  }
}