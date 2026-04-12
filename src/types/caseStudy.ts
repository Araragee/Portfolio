export interface CaseStudySection {
  heading: string
  body: string
  code?: {
    filename: string
    content: string
  }
}

export interface CaseStudyImage {
  src: string
  alt: string
}

export interface Project {
  slug: string
  index: string          // "01", "02", etc.
  title: string
  categoryLabel: string
  description: string
  backgroundImage: string
  // Case study specific
  role: string
  stack: string
  timeline: string
  liveUrl?: string
  introStatement: string
  heroImage: string
  sections: CaseStudySection[]
  gallery: CaseStudyImage[]
}
