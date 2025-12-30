import type { Skill, TimelineItem, SocialLink, PersonalInfo } from '@/types/about'

export const personalInfo: PersonalInfo = {
  name: 'Your Name',
  title: 'Front-end Developer',
  bio: [
    "I'm a passionate front-end developer with over 5 years of experience building modern, scalable web applications. I specialize in Vue.js, React, and TypeScript, with a keen eye for design and user experience.",
    "My journey in web development started with a curiosity about how things work on the web, and it has evolved into a professional career focused on creating accessible, performant, and beautiful digital experiences.",
    "When I'm not coding, you can find me contributing to open-source projects, writing technical articles, or exploring the latest web technologies and design trends."
  ],
  image: {
    alt: 'Profile photo'
  },
  contact: {
    email: 'your.email@example.com',
    location: 'San Francisco, CA'
  },
  availability: {
    status: 'available',
    message: 'Available for freelance projects'
  }
}

export const skills: Skill[] = [
  // Frontend
  { name: 'Vue.js', level: 95, category: 'frontend', color: 'from-green-400 to-emerald-500' },
  { name: 'React', level: 90, category: 'frontend', color: 'from-cyan-400 to-blue-500' },
  { name: 'TypeScript', level: 92, category: 'frontend', color: 'from-blue-400 to-indigo-500' },
  { name: 'JavaScript (ES6+)', level: 95, category: 'frontend', color: 'from-yellow-400 to-orange-500' },
  { name: 'HTML5 & CSS3', level: 98, category: 'frontend', color: 'from-orange-400 to-red-500' },
  { name: 'Tailwind CSS', level: 95, category: 'frontend', color: 'from-teal-400 to-cyan-500' },

  // Backend
  { name: 'Node.js', level: 85, category: 'backend', color: 'from-lime-400 to-green-500' },
  { name: 'Express.js', level: 80, category: 'backend', color: 'from-gray-400 to-gray-600' },
  { name: 'REST APIs', level: 88, category: 'backend', color: 'from-blue-400 to-purple-500' },
  { name: 'GraphQL', level: 75, category: 'backend', color: 'from-pink-400 to-purple-500' },

  // Tools & Others
  { name: 'Git & GitHub', level: 92, category: 'tools', color: 'from-gray-700 to-gray-900' },
  { name: 'Vite', level: 90, category: 'tools', color: 'from-purple-400 to-pink-500' },
  { name: 'Webpack', level: 80, category: 'tools', color: 'from-blue-400 to-cyan-500' },
  { name: 'Jest & Vitest', level: 82, category: 'tools', color: 'from-red-400 to-pink-500' },

  // Design
  { name: 'UI/UX Design', level: 85, category: 'design', color: 'from-purple-400 to-pink-500' },
  { name: 'Figma', level: 88, category: 'design', color: 'from-purple-500 to-pink-500' },
  { name: 'Responsive Design', level: 95, category: 'design', color: 'from-indigo-400 to-purple-500' },
  { name: 'Accessibility (WCAG)', level: 85, category: 'design', color: 'from-green-400 to-teal-500' }
]

export const timeline: TimelineItem[] = [
  {
    id: 1,
    type: 'experience',
    title: 'Senior Front-end Developer',
    organization: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    period: {
      start: 'Jan 2022',
      end: 'Present'
    },
    description: 'Leading front-end development for enterprise web applications serving 100k+ users. Architecting scalable solutions with Vue 3 and TypeScript.',
    highlights: [
      'Reduced bundle size by 40% through code splitting and optimization',
      'Implemented design system used across 15+ applications',
      'Mentored junior developers and conducted code reviews',
      'Improved app performance by 60% using lazy loading and caching strategies'
    ],
    tags: ['Vue 3', 'TypeScript', 'Tailwind CSS', 'Performance']
  },
  {
    id: 2,
    type: 'experience',
    title: 'Front-end Developer',
    organization: 'Digital Solutions Co.',
    location: 'Remote',
    period: {
      start: 'Mar 2020',
      end: 'Dec 2021'
    },
    description: 'Developed responsive web applications and collaborated with cross-functional teams to deliver high-quality products.',
    highlights: [
      'Built 10+ client projects from concept to deployment',
      'Integrated RESTful APIs and GraphQL endpoints',
      'Implemented automated testing with Jest and Cypress',
      'Contributed to open-source component library'
    ],
    tags: ['React', 'Node.js', 'GraphQL', 'Testing']
  },
  {
    id: 3,
    type: 'experience',
    title: 'Junior Web Developer',
    organization: 'Creative Agency LLC',
    location: 'New York, NY',
    period: {
      start: 'Jun 2019',
      end: 'Feb 2020'
    },
    description: 'Worked on client websites and marketing campaigns, focusing on responsive design and cross-browser compatibility.',
    highlights: [
      'Developed 15+ landing pages with high conversion rates',
      'Implemented A/B testing for optimization',
      'Collaborated with designers using Figma and Adobe XD'
    ],
    tags: ['HTML/CSS', 'JavaScript', 'WordPress', 'SEO']
  },
  {
    id: 4,
    type: 'education',
    title: 'Bachelor of Science in Computer Science',
    organization: 'University of Technology',
    location: 'Boston, MA',
    period: {
      start: '2015',
      end: '2019'
    },
    description: 'Graduated with honors. Focused on software engineering, web technologies, and human-computer interaction.',
    highlights: [
      'GPA: 3.8/4.0',
      'Dean\'s List all semesters',
      'President of Web Development Club',
      'Senior project: Real-time collaboration platform'
    ],
    tags: ['Computer Science', 'Web Development', 'Algorithms']
  },
  {
    id: 5,
    type: 'achievement',
    title: 'AWS Certified Developer',
    organization: 'Amazon Web Services',
    period: {
      start: '2021',
      end: '2021'
    },
    description: 'Achieved AWS Certified Developer - Associate certification, demonstrating expertise in developing and maintaining AWS-based applications.',
    tags: ['AWS', 'Cloud', 'Certification']
  },
  {
    id: 6,
    type: 'achievement',
    title: 'Open Source Contributor',
    organization: 'Vue.js Community',
    period: {
      start: '2020',
      end: 'Present'
    },
    description: 'Active contributor to Vue.js ecosystem with 50+ merged pull requests across various projects.',
    highlights: [
      'Contributed to Vue Router and Pinia documentation',
      'Maintained popular Vue component library (2k+ stars)',
      'Spoke at local Vue.js meetups'
    ],
    tags: ['Open Source', 'Community', 'Vue.js']
  }
]

export const socialLinks: SocialLink[] = [
  {
    platform: 'GitHub',
    url: 'https://github.com/yourusername',
    icon: 'github',
    username: '@yourusername',
    color: 'hover:text-gray-900 dark:hover:text-white'
  },
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/yourusername',
    icon: 'linkedin',
    username: 'yourusername',
    color: 'hover:text-blue-600 dark:hover:text-blue-400'
  },
  {
    platform: 'Twitter',
    url: 'https://twitter.com/yourusername',
    icon: 'twitter',
    username: '@yourusername',
    color: 'hover:text-sky-500 dark:hover:text-sky-400'
  },
  {
    platform: 'Email',
    url: 'mailto:your.email@example.com',
    icon: 'email',
    color: 'hover:text-red-500 dark:hover:text-red-400'
  },
  {
    platform: 'CodePen',
    url: 'https://codepen.io/yourusername',
    icon: 'codepen',
    username: '@yourusername',
    color: 'hover:text-green-600 dark:hover:text-green-400'
  }
]
