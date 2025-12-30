# Portfolio Website

A modern, animated portfolio website built with Vue 3, TypeScript, and Tailwind CSS.

## Features

- **Vue 3 with Composition API** - Modern Vue.js with `<script setup>` syntax
- **TypeScript** - Full type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework with custom configuration
- **Anime.js** - Smooth, performant animations
- **Parallax Effects** - Scroll-based parallax for engaging user experience
- **Glassmorphism Design** - Modern UI with glass effects
- **Dark/Light Theme** - Toggle between dark and light modes
- **Fully Responsive** - Mobile-first design
- **Scroll Animations** - Elements animate on scroll
- **Smooth Scrolling** - Seamless navigation between sections
- **Interactive Project Cards** - 3D tilt effects and hover animations
- **Project Filtering** - Category-based filtering system with smooth transitions
- **Advanced Animations** - Anime.js powered hover effects with scale and tilt

## Project Structure

```
Portfolio/
├── src/
│   ├── assets/
│   │   └── main.css              # Global styles with Tailwind
│   ├── components/
│   │   ├── Landing/
│   │   │   ├── HeroSection.vue   # Hero section with animations
│   │   │   ├── FloatingShapes.vue # Animated background shapes
│   │   │   └── ScrollIndicator.vue # Scroll indicator
│   │   ├── Projects/
│   │   │   ├── ProjectsSection.vue # Projects showcase
│   │   │   └── ProjectCard.vue   # Individual project card
│   │   └── About/
│   │       └── AboutSection.vue  # About section with skills
│   ├── composables/
│   │   ├── useScrollAnimation.ts # Scroll animation utilities
│   │   └── useParallax.ts       # Parallax effect utilities
│   ├── router/
│   │   └── index.ts             # Vue Router configuration
│   ├── App.vue                  # Main app component
│   ├── main.ts                  # App entry point
│   └── vite-env.d.ts           # TypeScript declarations
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Customization

### Update Personal Information

1. **Hero Section** - Edit [src/components/Landing/HeroSection.vue](src/components/Landing/HeroSection.vue):
   - Update your name (line 70)
   - Update your title (line 79)
   - Update your tagline (line 88)

2. **Projects** - Edit [src/components/Projects/ProjectsSection.vue](src/components/Projects/ProjectsSection.vue):
   - Update the projects array with your own projects (lines 13-40)

3. **About Section** - Edit [src/components/About/AboutSection.vue](src/components/About/AboutSection.vue):
   - Update the bio text (lines 45-60)
   - Update skills array (lines 9-16)

4. **Contact Information** - Edit [src/App.vue](src/App.vue):
   - Update email address (line 179)
   - Update GitHub link (line 193)

### Customize Theme

Edit [tailwind.config.js](tailwind.config.js) to customize colors, fonts, and other design tokens.

### Add More Sections

Create new components in the `src/components` directory and import them in [src/App.vue](src/App.vue).

## Technologies Used

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Typed superset of JavaScript
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Anime.js** - JavaScript animation library
- **Vue Router** - Official router for Vue.js

## Performance Optimizations

- Lazy loading of components
- Optimized animations with `requestAnimationFrame`
- Passive event listeners for scroll
- CSS containment for better rendering performance
- Tree-shaking for smaller bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Credits

Built with Vue 3, TypeScript, and Tailwind CSS
