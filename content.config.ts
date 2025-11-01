// content.config.ts
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      // only index MD/MDC/YAML/JSON files as docs
      source: '**/*.{md,mdc,yml,yaml,json}',
      schema: z.object({
        title: z.string().optional(),
        summary: z.string().optional(),
        cover: z.string().optional(),
        order: z.number().optional(),
        groupOrder: z.number().optional(),
      })
    })
  }
})
