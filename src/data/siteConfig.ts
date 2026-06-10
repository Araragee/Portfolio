export const siteConfig = {
  // Brand details
  brandName: 'DAVE GONZALES',
  tagline: 'Frontend Engineer',
  
  // Default SEO Metadata
  seo: {
    defaultTitle: 'DAVE GONZALES — Frontend Engineer Portfolio',
    description: 'Portfolio of Dex, a Vue.js & TypeScript engineer specializing in scalable web architectures, design systems, and performance.',
    url: 'https://architect-vue.vercel.app',
    keywords: [
      'web developer',
      'front-end developer',
      'vue developer',
      'typescript developer',
      'portfolio',
      'web architecture',
      'ui/ux',
      'vue 3',
      'pinia',
      'design systems'
    ],
    author: 'Dave Gonzales',
    jobTitle: 'Front-end Developer'
  },

  // Tech Badge Subtitle used in Navbar
  techStackSubtitle: 'VUE3 / TS / NODE',

  // Hero Section configuration
  hero: {
    availability: 'AVAILABLE FOR OPPORTUNITIES',
    location: 'Philippines (Remote)',
    headline: 'Vue.js &<br />TS Engineer',
    description: 'I build fast, boring, maintainable web applications with Vue and TypeScript.'
  },

  // Tech Marquee list
  techs: ['VUE3', 'TYPESCRIPT', 'VITE', 'PINIA', 'REACT', 'NODE.JS', 'TAILWIND'],

  // Bento Box section config
  bento: {
    philosophyTitle: 'Code<br />Philosophy',
    philosophyBody: "I like code that is easy to read, test, and delete. Clean, maintainable TypeScript is a requirement for systems that intend to last.",
    expertise: [
      { label: "Enterprise Vue 3", years: "3+ YRS" },
      { label: "TypeScript Arch", years: "3+ YRS" },
      { label: "Node.js Ecosystem", years: "2+ YRS" },
      { label: "Design Systems", years: "2+ YRS" },
    ],
    technologies: ["VUE 3", "REACT", "PINIA", "VITE", "NODE"]
  },

  // Manifesto Page specific configs
  manifesto: {
    pillars: [
      {
        number: '01',
        heading: 'Strict Types',
        body: 'TypeScript strict mode is non-negotiable. It catches errors before runtime and serves as live documentation for the next developer.',
      },
      {
        number: '02',
        heading: 'Simplicity',
        body: 'I subtract until only the essential remains. If a feature does not clarify the user\'s intent, it is noise. If a line of code does not earn its existence, it gets deleted.',
      },
      {
        number: '03',
        heading: 'Performance',
        body: 'A slow interface is a broken interface. Bundle size, render blocking, and layout shift are design decisions.',
      },
      {
        number: '04',
        heading: 'Composability',
        body: 'The Vue 3 Composition API changed my thinking about software. Logic should be composable, testable, and portable. Components should be declarative. State should have a single owner.',
      }
    ],
    referenceImage: {
      url: new URL('@/assets/projects/cbms-hero.png', import.meta.url).href,
      alt: 'Architecture reference',
      caption: 'Code as Architecture'
    }
  }
}
