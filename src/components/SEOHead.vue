<script setup lang="ts">
import { useHead } from '@unhead/vue'

interface Props {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  twitterCard?: string
  author?: string
  keywords?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Your Name - Front-end Developer Portfolio',
  description: 'Portfolio showcasing modern web development projects built with Vue 3, TypeScript, and cutting-edge technologies. Specializing in creating beautiful, performant, and accessible web applications.',
  image: '/og-image.jpg',
  url: 'https://yourportfolio.com',
  type: 'website',
  twitterCard: 'summary_large_image',
  author: 'Your Name',
  keywords: () => [
    'web developer',
    'front-end developer',
    'vue developer',
    'typescript developer',
    'portfolio',
    'web design',
    'ui/ux',
    'react developer'
  ]
})

// Use unhead for meta tags management
useHead({
  title: props.title,
  meta: [
    // Primary Meta Tags
    { name: 'title', content: props.title },
    { name: 'description', content: props.description },
    { name: 'keywords', content: props.keywords.join(', ') },
    { name: 'author', content: props.author },
    { name: 'robots', content: 'index, follow' },
    { name: 'language', content: 'English' },
    { name: 'revisit-after', content: '7 days' },

    // Open Graph / Facebook
    { property: 'og:type', content: props.type },
    { property: 'og:url', content: props.url },
    { property: 'og:title', content: props.title },
    { property: 'og:description', content: props.description },
    { property: 'og:image', content: props.image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:site_name', content: props.title },
    { property: 'og:locale', content: 'en_US' },

    // Twitter
    { name: 'twitter:card', content: props.twitterCard },
    { name: 'twitter:url', content: props.url },
    { name: 'twitter:title', content: props.title },
    { name: 'twitter:description', content: props.description },
    { name: 'twitter:image', content: props.image },
    { name: 'twitter:creator', content: '@yourusername' },

    // Theme Color
    { name: 'theme-color', content: '#0ea5e9' },
    { name: 'msapplication-TileColor', content: '#0ea5e9' },

    // Mobile
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0' },
    { name: 'format-detection', content: 'telephone=no' }
  ],
  link: [
    // Canonical URL
    { rel: 'canonical', href: props.url },

    // Favicon
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },

    // Web App Manifest
    { rel: 'manifest', href: '/site.webmanifest' }
  ],
  script: [
    // JSON-LD Structured Data
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: props.author,
        url: props.url,
        image: props.image,
        jobTitle: 'Front-end Developer',
        description: props.description,
        sameAs: [
          'https://github.com/yourusername',
          'https://linkedin.com/in/yourusername',
          'https://twitter.com/yourusername'
        ]
      })
    }
  ]
})
</script>

<template>
  <!-- This component doesn't render anything, it just sets meta tags -->
</template>
