// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  css: ['~/assets/css/tailwind.css'],


  experimental: {
    payloadExtraction: true
  }
})
