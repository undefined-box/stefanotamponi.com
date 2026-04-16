import data from './data.json'
import { AppData } from './types'
import { createHero } from './components/hero'
import { createArticle } from './components/article'
import { setupSkillInteractions, handleSkillSeparators } from './components/skillInteractions'
import { ThemeManager } from './utils/themeManager'
import { setupResumeButton } from './utils/musicPlayer'
import { calculateAndSetBioMinHeight } from './utils/bioHeightCalculator'

// Main Application
export class App {
  private data: AppData
  private themeManager: ThemeManager
  private currentView: 'home' | 'article' = 'home'

  constructor() {
    this.data = data as AppData
    this.themeManager = new ThemeManager(this.data.theme.toggleLabels.light, this.data.theme.toggleLabels.dark)
  }

  private handleRouting(): void {
    const hash = window.location.hash
    if (hash === '#cameraberry') {
      this.renderView('article')
    } else {
      this.renderView('home')
    }
  }

  private renderView(view: 'home' | 'article'): void {
    this.currentView = view
    const app = document.getElementById('app')!
    app.innerHTML = ''

    if (view === 'home') {
      const hero = createHero(this.data)
      app.appendChild(hero)
      
      // Re-setup interactions for hero
      setupSkillInteractions(this.data)
      const bioElement = document.getElementById('bio-text') as HTMLElement
      if (bioElement) {
        calculateAndSetBioMinHeight(this.data, bioElement)
      }
      handleSkillSeparators()

      // Re-attach link listeners to handle internal navigation
      hero.querySelectorAll('a.link').forEach(link => {
        const href = link.getAttribute('href')
        if (href && href.startsWith('#')) {
          link.addEventListener('click', (e) => {
            e.preventDefault()
            window.location.hash = href
          })
        }
      })
    } else if (view === 'article') {
      app.appendChild(createArticle(() => {
        window.location.hash = ''
      }))
    }
  }

  public mount(): void {
    this.themeManager.mount()
    
    // Update page title
    const titleElement = document.getElementById('page-title')
    if (titleElement) {
      titleElement.textContent = this.data.personalInfo.name
    }

    // Initial routing
    this.handleRouting()

    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRouting())
    
    // Handle skill separators after layout is settled
    document.fonts.ready.then(() => {
      handleSkillSeparators()
    })
    
    // Handle resize events
    let resizeTimeout: number
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeTimeout)
      resizeTimeout = requestAnimationFrame(() => {
        handleSkillSeparators()
        if (this.currentView === 'home') {
          const bioElement = document.getElementById('bio-text') as HTMLElement
          if (bioElement) {
            calculateAndSetBioMinHeight(this.data, bioElement)
          }
        }
      })
    })

    setupResumeButton()
  }
}