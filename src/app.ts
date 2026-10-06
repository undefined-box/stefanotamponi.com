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

    const projectPath = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/)
    const projectId = projectPath?.[1]
    if (projectId && this.articles[projectId]) {
      this.renderView('article', projectId)
      return
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
      const hero = createHero(this.data, this.articles)
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

      hero.querySelectorAll<HTMLAnchorElement>('a[data-project-id]').forEach(link => {
        link.addEventListener('click', event => {
          if (event.button !== 0) return
          event.preventDefault()
          window.location.hash = `#${link.dataset.projectId}`
        })

        link.addEventListener('auxclick', event => {
          if (event.button === 1) event.preventDefault()
        })
      })
    } else if (view === 'article' && articleId) {
      const article = this.articles[articleId]
      app.appendChild(createArticle(article, this.data, () => {
        if (window.location.pathname !== '/') {
          window.history.pushState(null, '', '/')
          this.handleRouting()
        } else {
          window.location.hash = ''
        }
      }))
    }

    // Sync labels after render
    updateResumeButtons()
  }

  public mount(): void {
    document.getElementById('static-fallback-footer')?.remove()
    this.themeManager.mount()
    
    // Initial routing
    this.handleRouting()

    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRouting())
    window.addEventListener('popstate', () => this.handleRouting())
    
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