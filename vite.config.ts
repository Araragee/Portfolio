import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-vue': ['vue', 'vue-router'],
          'vendor-animation': ['animejs'],
          'vendor-head': ['@unhead/vue'],

          // Component chunks
          'components-landing': [
            './src/components/Landing/HeroSection.vue',
            './src/components/Landing/FloatingShapes.vue',
            './src/components/Landing/ScrollIndicator.vue'
          ],
          'components-projects': [
            './src/components/Projects/ProjectsSection.vue',
            './src/components/Projects/ProjectCard.vue'
          ],
          'components-about': [
            './src/components/About/AboutSection.vue',
            './src/components/About/SkillsGrid.vue',
            './src/components/About/Timeline.vue',
            './src/components/About/SocialLinks.vue'
          ]
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: false,
    // Minify with terser for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    }
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['vue', 'vue-router', 'animejs', '@unhead/vue']
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
