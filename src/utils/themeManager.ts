import { THEME_TOGGLE_CLASS, THEME_DARK_CLASS, LOCAL_STORAGE_THEME_KEY, THEME_DARK_VALUE, THEME_LIGHT_VALUE } from './constants';

export class ThemeManager {
  private toggle: HTMLButtonElement
  private lightLabel: string
  private darkLabel: string

  constructor(lightLabel: string, darkLabel: string) {
    this.lightLabel = lightLabel
    this.darkLabel = darkLabel
    this.toggle = this.createToggle()
    this.initializeTheme()
  }

  private createToggle(): HTMLButtonElement {
    const toggle = document.createElement('button')
    toggle.className = THEME_TOGGLE_CLASS
    toggle.setAttribute('aria-label', 'Toggle theme')
    toggle.setAttribute('role', 'switch')
    toggle.setAttribute('aria-pressed', 'false')
    
    toggle.addEventListener('click', () => {
      this.setTheme(!document.body.classList.contains(THEME_DARK_CLASS))
    })
    
    return toggle
  }

  private renderToggle(dark: boolean): void {
    this.toggle.textContent = dark ? this.lightLabel : this.darkLabel
    this.toggle.setAttribute('aria-pressed', dark ? 'true' : 'false')
  }

  private setTheme(dark: boolean): void {
    if (dark) {
      document.body.classList.add(THEME_DARK_CLASS)
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, THEME_DARK_VALUE)
    } else {
      document.body.classList.remove(THEME_DARK_CLASS)
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, THEME_LIGHT_VALUE)
    }
    this.renderToggle(dark)
  }

  private initializeTheme(): void {
    const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY)
    if (saved) {
      this.setTheme(saved === THEME_DARK_VALUE)
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      this.setTheme(prefersDark)
    }
  }

  public mount(): void {
    const app = document.getElementById('app') || document.body
    app.appendChild(this.toggle)
  }
}