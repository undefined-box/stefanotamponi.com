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

export interface ArticleSection {
  title: string
  content: string
  isLead?: boolean
}

export interface GalleryImage {
  src: string
  title: string
  desc: string
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  mainImage: {
    src: string;
    alt: string;
    caption: string;
    shouldInvert?: boolean;
  };
  secondaryImage?: {
    src: string;
    alt: string;
    caption: string;
    shouldInvert?: boolean;
  };
  components: string[];
  sections: ArticleSection[];
  gallery: GalleryImage[];
}

export interface ArticlesData {
  [key: string]: Article
}
