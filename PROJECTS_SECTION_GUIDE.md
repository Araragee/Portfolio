# Projects Section - Implementation Guide

## Overview

The Projects section has been completely rebuilt with advanced features including filtering, animations, and interactive card designs.

## Features Implemented

### 1. TypeScript Type System

**File:** [src/types/project.ts](src/types/project.ts)

Complete type definitions for project data structure:

```typescript
- ProjectCategory: 'web-app' | 'mobile' | 'ui-ux' | 'api' | 'tool' | 'all'
- ProjectImage: Image data with gradient fallback
- ProjectLink: Link with URL and label
- Project: Complete project data structure
- ProjectFilter: Filter configuration
```

### 2. Category Filtering System

**Location:** [src/components/Projects/ProjectsSection.vue](src/components/Projects/ProjectsSection.vue)

- 5 filter categories: All, Web Apps, UI/UX, APIs, Tools
- Dynamic project count badges
- Smooth filter transitions with Vue TransitionGroup
- Active state styling with gradient backgrounds
- Responsive filter button layout

### 3. Advanced Project Cards

**File:** [src/components/Projects/ProjectCard.vue](src/components/Projects/ProjectCard.vue)

#### Scroll-Triggered Animations
- IntersectionObserver for viewport detection
- Staggered entrance animations (100ms delay per card)
- Opacity fade-in from 0 to 1
- Slide up from 60px with scale from 0.9 to 1
- 3D rotation effect on entry (rotateX from 10° to 0°)

#### Hover Animations (Anime.js)
- **Scale Effect**: Card scales to 1.05 on hover
- **3D Tilt**: Subtle rotateY (2°) for depth
- **Image Zoom**: Background gradient scales to 1.1
- **Mouse Tracking**: Dynamic tilt based on cursor position
  - Max rotation: ±5° on X and Y axes
  - Smooth easing with `easeOutQuad`

#### Interactive Elements
- **Featured Badge**: Yellow-orange gradient for featured projects
- **Category Badge**: Glassmorphism badge on image
- **Hover Overlay**: "View Project" text appears on hover
- **Bottom Accent**: Gradient line reveals on hover
- **Tech Tags**: First 4 tags shown, remaining count displayed
- **Multiple Link Types**: Demo, GitHub, Case Study

### 4. Responsive Grid Layout

```css
- Mobile (default): 1 column
- Tablet (md): 2 columns
- Desktop (lg): 3 columns
- Gap: 2rem (32px) between cards
```

### 5. Parallax Background

Two parallax decorative elements:
- Top-right orb: Speed 0.3 (moves with scroll)
- Bottom-left orb: Speed -0.2 (moves opposite)
- Additional geometric shapes (square, circle)

### 6. Project Data Structure

Six realistic placeholder projects included:

1. **E-Commerce Platform** (Web App, Featured)
   - Tags: Vue 3, TypeScript, Node.js, MongoDB, Stripe, Tailwind CSS
   - Demo + GitHub links

2. **Task Management Dashboard** (Web App, Featured)
   - Tags: React, TypeScript, Firebase, DnD Kit, Zustand, Material-UI
   - Demo + GitHub + Case Study links

3. **Analytics Dashboard** (Web App)
   - Tags: Vue 3, D3.js, Chart.js, TypeScript, Vite, Pinia
   - Demo + GitHub links

4. **Design System Library** (UI/UX, Featured)
   - Tags: Vue 3, TypeScript, Storybook, Vitest, Accessibility, CSS Variables
   - Storybook + GitHub links

5. **REST API Framework** (API)
   - Tags: Node.js, Express, PostgreSQL, Redis, JWT, Swagger
   - GitHub + Documentation links

6. **Developer CLI Tool** (Tool)
   - Tags: Node.js, TypeScript, Commander.js, Inquirer, Chalk
   - GitHub link

## Customization Guide

### Adding New Projects

Edit [src/components/Projects/ProjectsSection.vue](src/components/Projects/ProjectsSection.vue#L9-L124):

```typescript
{
  id: 7, // Unique ID
  title: 'Your Project Name',
  description: 'Short description (shown on card)',
  longDescription: 'Detailed description (optional)',
  category: 'web-app', // web-app | ui-ux | api | tool | mobile
  tags: ['Vue 3', 'TypeScript', 'etc'], // Tech stack
  image: {
    alt: 'Project screenshot description',
    gradient: 'from-blue-500 to-purple-500' // Tailwind gradient
  },
  links: {
    demo: { url: 'https://...', label: 'View Demo' },
    github: { url: 'https://...', label: 'Code' },
    case_study: { url: 'https://...', label: 'Case Study' } // Optional
  },
  featured: true, // Shows featured badge
  year: 2024,
  status: 'completed' // completed | in-progress | archived
}
```

### Adding New Categories

1. Update type in [src/types/project.ts](src/types/project.ts#L1):
```typescript
export type ProjectCategory = 'web-app' | 'mobile' | 'ui-ux' | 'api' | 'tool' | 'your-category' | 'all'
```

2. Add filter in [ProjectsSection.vue](src/components/Projects/ProjectsSection.vue#L127-L133):
```typescript
{ category: 'your-category', label: 'Your Label' }
```

### Customizing Animations

#### Card Entrance Animation
[ProjectCard.vue:33-42](src/components/Projects/ProjectCard.vue#L33-L42)

```typescript
anime({
  targets: entry.target,
  opacity: [0, 1],        // Fade in
  translateY: [60, 0],    // Slide up distance
  scale: [0.9, 1],        // Scale up
  rotateX: [10, 0],       // 3D rotation
  duration: 800,          // Animation duration
  delay: props.index * 100, // Stagger delay
  easing: 'easeOutCubic'
})
```

#### Hover Scale & Tilt
[ProjectCard.vue:69-89](src/components/Projects/ProjectCard.vue#L69-L89)

```typescript
// Adjust scale value
scale: 1.05  // Change to 1.08 for stronger effect

// Adjust rotation
rotateY: 2   // Change to 3 for more tilt
```

#### Mouse Tracking Sensitivity
[ProjectCard.vue:127-128](src/components/Projects/ProjectCard.vue#L127-L128)

```typescript
const rotateX = ((y - centerY) / centerY) * -5  // Change 5 to adjust
const rotateY = ((x - centerX) / centerX) * 5   // Higher = more rotation
```

### Styling Customization

#### Card Design
[ProjectCard.vue:141-147](src/components/Projects/ProjectCard.vue#L141-L147)

```vue
class="
  bg-white dark:bg-gray-900           // Background color
  rounded-2xl                         // Border radius
  shadow-xl hover:shadow-2xl          // Shadow intensity
  border border-gray-200              // Border style
"
```

#### Gradient Colors
Change project gradients in the data:
```typescript
gradient: 'from-purple-500 via-pink-500 to-red-500'
```

Available Tailwind gradients:
- Blue to Purple: `from-blue-500 via-purple-500 to-pink-500`
- Green to Teal: `from-emerald-500 via-teal-500 to-cyan-500`
- Orange to Red: `from-orange-500 via-red-500 to-pink-500`

## Performance Optimizations

1. **Intersection Observer**: Cards only animate when entering viewport
2. **Once-only Animations**: Entrance animations run once and unobserve
3. **RequestAnimationFrame**: Parallax uses RAF for smooth 60fps
4. **CSS Transforms**: All animations use GPU-accelerated transforms
5. **Passive Event Listeners**: Scroll listeners are passive
6. **Lazy Rendering**: TransitionGroup only renders filtered projects

## Browser Support

- Modern browsers with IntersectionObserver support
- CSS transforms and perspective support required
- Fallback: Cards still visible without animations

## Accessibility

- Semantic HTML: `<article>` for cards
- Proper heading hierarchy: `<h3>` for titles
- ARIA labels not needed (semantic markup sufficient)
- Keyboard navigation: All links are focusable
- Focus states: Tailwind focus utilities applied

## Animation Performance Tips

1. **Reduce Animation Count**: Lower stagger delay for faster load
2. **Disable on Mobile**: Add media query to skip animations on mobile
3. **Reduce Parallax**: Lower speed values for smoother performance
4. **Limit Projects**: Show 6-9 projects per page for best performance

## Common Issues

**Q: Cards not animating on scroll?**
A: Check browser supports IntersectionObserver. Check console for errors.

**Q: Tilt effect too strong?**
A: Reduce rotation values in `handleMouseMove` function (line 127-128).

**Q: Filter transitions janky?**
A: Reduce number of projects or increase transition duration.

**Q: Cards overlapping?**
A: Check grid gap and ensure proper responsive breakpoints.

## Files Modified

1. ✅ [src/types/project.ts](src/types/project.ts) - Type definitions
2. ✅ [src/components/Projects/ProjectsSection.vue](src/components/Projects/ProjectsSection.vue) - Section with filtering
3. ✅ [src/components/Projects/ProjectCard.vue](src/components/Projects/ProjectCard.vue) - Enhanced card component
4. ✅ [README.md](README.md) - Updated documentation

## Next Steps

1. Replace placeholder gradients with real project images
2. Update project URLs to your actual demo/GitHub links
3. Adjust filter categories based on your project types
4. Customize color gradients to match your brand
5. Add loading states for better UX
6. Consider pagination for 10+ projects
