import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // ...
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  css: ['@/assets/css/tailwind.css'], 
})
