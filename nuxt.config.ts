// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  vite: {
    cacheDir: '.nuxt/vite-cache',
    optimizeDeps: {
      // ensures a fresh rebuild of the dep graph after the cache move
      force: true
    }
  }
})
