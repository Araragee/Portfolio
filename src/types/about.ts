export interface Skill {
  name: string
  level: number // 0-100
  category: 'frontend' | 'backend' | 'tools' | 'design'
  icon?: string
  color?: string
}

export interface SkillCategory {
  name: string
  skills: Skill[]
}

export interface TimelineItem {
  id: number
  type: 'experience' | 'education' | 'achievement'
  title: string
  organization: string
  location?: string
  period: {
    start: string
    end: string | 'Present'
  }
  description: string
  highlights?: string[]
  tags?: string[]
  icon?: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: 'github' | 'linkedin' | 'twitter' | 'email' | 'dribbble' | 'codepen' | 'medium'
  username?: string
  color?: string
}

export interface PersonalInfo {
  name: string
  title: string
  bio: string[]
  image?: {
    url?: string
    alt: string
  }
  contact: {
    email: string
    phone?: string
    location?: string
  }
  availability?: {
    status: 'available' | 'busy' | 'unavailable'
    message?: string
  }
}

export interface AboutData {
  personal: PersonalInfo
  skills: Skill[]
  timeline: TimelineItem[]
  socials: SocialLink[]
}
