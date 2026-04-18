import data from './data.json'
import articlesData from './articles.json'
import { AppData, ArticlesData } from './types'
import { createHero } from './components/hero'
import { createArticle } from './components/article'
import { setupSkillInteractions, handleSkillSeparators } from './components/skillInteractions'
import { ThemeManager } from './utils/themeManager'
import { setupResumeButton, updateResumeButtons } from './utils/musicPlayer'
import { calculateAndSetBioMinHeight } from './utils/bioHeightCalculator'

// Main Application
export class App {
  private data: AppData
  private articles: ArticlesData
  private themeManager: ThemeManager
  private currentView: 'home' | 'article' = 'home'

  constructor() {
    this.data = data as AppData
    this.articles = articlesData as ArticlesData
    this.themeManager = new ThemeManager(this.data.theme.toggleLabels.light, this.data.theme.toggleLabels.dark)
  }

  private handleRouting(): void {
    const hash = window.location.hash
    if (hash.startsWith('#')) {
      const articleId = hash.substring(1)
      if (this.articles[articleId]) {
        this.renderView('article', articleId)
        return
      }
    }
    this.renderView('home')
  }

  private renderView(view: 'home' | 'article', articleId?: string): void {
    this.currentView = view
    const app = document.getElementById('app')!
    
    // Preserve UI elements
    const uiElements = Array.from(app.querySelectorAll('.theme-toggle, .music-toggle'))
    app.innerHTML = ''
    uiElements.forEach(el => app.appendChild(el))

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
    } else if (view === 'article' && articleId) {
      const article = this.articles[articleId]
      app.appendChild(createArticle(article, this.data, () => {
        window.location.hash = ''
      }))
    }

    // Sync labels after render
    updateResumeButtons()
  }

  public mount(): void {
    this.themeManager.mount()
    
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