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

````
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
````
