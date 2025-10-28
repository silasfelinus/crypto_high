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
    '@prisma/nuxt',
    '@pinia/nuxt'
  ],

  css: ['~/assets/css/tailwind.css'],


  image: {
    dir: 'public/images',
    inject: true
  },


  experimental: {
    payloadExtraction: true
  }
})
