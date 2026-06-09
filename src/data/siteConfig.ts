export const siteConfig = {
  // Brand details
  brandName: 'ARCHITECT.VUE',
  tagline: 'Frontend Engineer',
  
  // Default SEO Metadata
  seo: {
    defaultTitle: 'ARCHITECT.VUE — Frontend Engineer Portfolio',
    description: 'Portfolio of Dex — Senior Vue.js & TypeScript engineer specializing in scalable web architectures, design systems, and performance optimization.',
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
    author: 'Dex Gonzales',
    jobTitle: 'Senior Front-end Developer'
  },

  // Tech Badge Subtitle used in Navbar
  techStackSubtitle: 'VUE3 / TS / NODE',

  // Hero Section configuration
  hero: {
    availability: 'AVAILABLE FOR OPPORTUNITIES',
    location: 'Philippines — Remote',
    headline: 'Senior Vue.js<br />& TS Engineer',
    description: 'Building hyper-efficient, structurally sound web architectures with TypeScript and Vue. Focusing on technical precision and performance optimization.'
  },

  // Tech Marquee list
  techs: ['VUE3', 'TYPESCRIPT', 'VITE', 'PINIA', 'REACT', 'NODE.JS', 'TAILWIND'],

  // Bento Box section config
  bento: {
    philosophyTitle: 'Code as<br />Architecture',
    philosophyBody: "I believe software should be built with the same longevity and structural integrity as physical landmarks. Clean, maintainable TypeScript isn't just a preference — it's a requirement for systems that intend to last.",
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
        number: 'Pillar 01',
        heading: 'Structural Integrity',
        body: 'Code should reflect the physical world. Clean abstractions and modular patterns ensure a system that can withstand the weight of expansion without collapse. TypeScript strict mode is non-negotiable.',
      },
      {
        number: 'Pillar 02',
        heading: 'Aggressive Minimalism',
        body: 'Subtract until only the essential remains. If a feature does not clarify the user\'s intent, it is noise. If a line of code does not earn its existence, it is deleted.',
      },
      {
        number: 'Pillar 03',
        heading: 'Performance as Design',
        body: 'A slow interface is a broken interface. Bundle size, render blocking, and layout shift are design decisions — not afterthoughts for the DevOps team.',
      },
      {
        number: 'Pillar 04',
        heading: 'Composable Architecture',
        body: 'The Vue 3 Composition API changed my thinking about software. Logic should be composable, testable, and portable. Components should be declarative. State should have a single owner.',
      }
    ],
    referenceImage: {
      url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
      alt: 'Minimalist brutalist architecture — clean geometric forms against a pale sky',
      caption: 'Structural Reference: Brutalist Precision, 2026'
    }
  }
}
