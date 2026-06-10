import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { templateCompilerOptions } from '@tresjs/core'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  // templateCompilerOptions teaches the Vue compiler about Tres* / primitive elements
  plugins: [vue({ ...templateCompilerOptions })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-animation': ['animejs'],
          'vendor-head': ['@unhead/vue'],
          'vendor-three': ['three', '@tresjs/core'],
          'components-home': [
            './src/components/Home/HeroSection.vue',
            './src/components/Home/TechMarquee.vue',
            './src/components/Home/ProjectsArchive.vue',
            './src/components/Home/ProjectRow.vue',
            './src/components/Home/BentoSection.vue',
            './src/components/Home/CTASection.vue',
          ],
          'components-case-study': [
            './src/components/CaseStudy/GrayscaleImage.vue',
            './src/components/CaseStudy/NextProjectFooter.vue',
          ],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'esbuild',
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'animejs', '@unhead/vue', 'lenis']
  },
  // Server configuration
  server: {
    port: 5173,
    host: true,
    open: true
  },
  // Preview configuration
  preview: {
    port: 4173,
    host: true
  }
})
