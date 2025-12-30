export type ProjectCategory = 'web-app' | 'mobile' | 'ui-ux' | 'api' | 'tool' | 'all'

export interface ProjectImage {
  url?: string
  alt: string
  gradient?: string // Fallback gradient if no image
}

export interface ProjectLink {
  url: string
  label: string
}

export interface Project {
  id: number
  title: string
  description: string
  longDescription?: string
  category: ProjectCategory
  tags: string[]
  image: ProjectImage
  links: {
    demo?: ProjectLink
    github?: ProjectLink
    case_study?: ProjectLink
  }
  featured?: boolean
  year?: number
  status?: 'completed' | 'in-progress' | 'archived'
}

export interface ProjectFilter {
  category: ProjectCategory
  label: string
  count?: number
}
