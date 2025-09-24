// Data types
export interface PersonalInfo {
  name: string
  title: string
  location: string
  bio: string
}

export interface Link {
  label: string
  href: string
  ariaLabel: string
}

export interface AppData {
  personalInfo: PersonalInfo
  skills: string[]
  skillDescriptions: Record<string, string>
  links: Link[]
  theme: {
    toggleLabels: {
      light: string
      dark: string
    }
  }
}
