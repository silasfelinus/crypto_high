// scripts/scaffold-crypto-high.mjs
// Quick scaffold for Crypto High with Nuxt Content
// Usage: node scripts/scaffold-crypto-high.mjs [--force]

import { promises as fs } from 'fs'
import path from 'path'
const FORCE = process.argv.includes('--force')

const files = {
  // Pages
  'pages/[...slug].vue': `
<script setup lang="ts">
const route = useRoute()
const path = '/' + (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug || '')
</script>

<template>
  <main class="container mx-auto p-6 prose max-w-none">
    <ContentDoc :path="path" />
  </main>
</template>
`.trim(),

  // Components used inside Markdown
  'components/Hero.vue': `
<script setup lang="ts">
const props = defineProps<{ title: string; subtitle?: string; image?: string }>()
</script>

<template>
  <section class="grid md:grid-cols-2 gap-6 items-center not-prose">
    <div>
      <h1 class="text-4xl font-bold">{{ props.title }}</h1>
      <p v-if="props.subtitle" class="mt-2 text-lg text-gray-600">{{ props.subtitle }}</p>
    </div>
    <img v-if="props.image" :src="props.image" class="rounded" alt="" />
  </section>
</template>
`.trim(),

  'components/ImageBlock.vue': `
<script setup lang="ts">
const props = defineProps<{ src: string; alt?: string; caption?: string }>()
</script>

<template>
  <figure class="space-y-2 not-prose">
    <img :src="props.src" :alt="props.alt || ''" class="w-full rounded object-cover" />
    <figcaption v-if="props.caption" class="text-sm text-gray-500">{{ props.caption }}</figcaption>
  </figure>
</template>
`.trim(),

  'components/TextBlock.vue': `
<template>
  <div class="prose max-w-none">
    <slot />
  </div>
</template>
`.trim(),

  'components/Placeholder.vue': `
<script setup lang="ts">
const props = defineProps<{ height?: string }>()
</script>
<template>
  <div class="w-full bg-gray-200 animate-pulse rounded not-prose" :style="{ height: props.height || '120px' }" />
</template>
`.trim(),

  // Grouped TOC
  'components/CHSectionListGrouped.vue': `
<script setup lang="ts">
type AnyDoc = {
  _path: string
  title?: string
  summary?: string
  cover?: string
  groupOrder?: number
  order?: number
}

const { data } = await useAsyncData('ch-tree', async () => {
  const docs: AnyDoc[] = await queryContent('/crypto-high/sections')
    .only(['_path','title','summary','cover','groupOrder','order'])
    .find()

  const groups = new Map<string, AnyDoc & { children: AnyDoc[] }>()
  for (const d of docs) {
    const parts = d._path.split('/').filter(Boolean)
    const iSections = parts.indexOf('sections')
    const groupSlug = parts[iSections + 1]
    const isGroup = parts.length === iSections + 2
    if (!groupSlug) continue
    if (isGroup) {
      groups.set(groupSlug, { ...d, children: [] })
    } else {
      const g = groups.get(groupSlug) || { _path: \`/crypto-high/sections/\${groupSlug}\`, title: groupSlug, children: [] }
      g.children.push(d)
      groups.set(groupSlug, g as any)
    }
  }

  const arr = Array.from(groups.values())
  for (const g of arr) {
    g.children.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999) || (a.title || '').localeCompare(b.title || ''))
  }
  arr.sort((a, b) => (a.groupOrder ?? 9999) - (b.groupOrder ?? 9999) || (a.title || '').localeCompare(b.title || ''))
  return arr
})
</script>

<template>
  <section class="space-y-10">
    <div v-for="g in data || []" :key="g._path">
      <NuxtLink :to="g._path" class="group flex items-center gap-4 mb-3">
        <img v-if="g.cover" :src="g.cover" alt="" class="w-20 h-12 object-cover rounded" />
        <h2 class="text-2xl font-semibold group-hover:underline">{{ g.title }}</h2>
      </NuxtLink>

      <div class="grid gap-6 md:grid-cols-2">
        <NuxtLink
          v-for="s in g.children"
          :key="s._path"
          :to="s._path"
          class="block border rounded overflow-hidden hover:shadow-lg transition"
        >
          <img v-if="s.cover" :src="s.cover" alt="" class="w-full aspect-video object-cover" />
          <div class="p-4">
            <h3 class="text-lg font-semibold">{{ s.title }}</h3>
            <p v-if="s.summary" class="mt-1 text-gray-600 text-sm">{{ s.summary }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
`.trim(),

  // Specials renderer
  'components/CHSpecials.vue': `
<script setup lang="ts">
const props = withDefaults(defineProps<{
  position: 'front' | 'end'
  title?: string
}>(), { title: undefined })

const base = \`/crypto-high/specials/\${props.position}\`

const { data: specials } = await useAsyncData(
  \`ch-specials-\${props.position}\`,
  () => queryContent(base)
        .where({ _type: 'markdown' })
        .without(['body'])
        .only(['_path','title','order'])
        .sort({ order: 1, title: 1 })
        .find()
)
</script>

<template>
  <section v-if="(specials && specials.length)" class="space-y-6">
    <h2 v-if="title" class="text-2xl font-semibold">{{ title }}</h2>
    <div v-for="doc in specials" :key="doc._path" class="space-y-4">
      <ContentDoc :path="doc._path">
        <template #empty>
          <div class="text-gray-500">No content.</div>
        </template>
      </ContentDoc>
      <hr class="border-gray-200" />
    </div>
  </section>
</template>
`.trim(),

  // Front page
  'content/index.md': `
---
title: Crypto High
---

<Hero title="Crypto High" subtitle="a memoir of unreal events" />

<CHSpecials position="front" title="Dedicated" />

<ContentDoc path="/crypto-high/intro" />

## Table of contents
<CHSectionListGrouped />

<ContentDoc path="/crypto-high/close" />

<CHSpecials position="end" title="Afterward" />
`.trim(),

  // Intro and Close
  'content/crypto-high/intro.md': `
---
title: Intro
---

<ImageBlock src="./intro.jpg" alt="Opening image" />

<TextBlock>
When the world tilted, I kept notes. Crypto High is a map of those tilts.
</TextBlock>
`.trim(),

  'content/crypto-high/close.md': `
---
title: Closing
---

<TextBlock>
Thanks for reading. If a page here took you back to your own storm, we did our job.
</TextBlock>

<ImageBlock src="./close.jpg" alt="Closing image" />
`.trim(),

  // Specials
  'content/crypto-high/specials/front/dedicated.md': `
---
title: Dedicated
order: 1
---

<ImageBlock src="./dedicated.jpg" alt="Quiet morning light" />
<TextBlock>For the ones who steadied the room when it started to spin.</TextBlock>
`.trim(),

  'content/crypto-high/specials/end/afterward.md': `
---
title: Afterward
order: 1
---

<TextBlock>
Loose ends, annotations, and a few truer sentences found at the end.
</TextBlock>
<ImageBlock src="./afterward.jpg" alt="Marked-up pages" />
`.trim(),

  // Group index pages
  'content/crypto-high/sections/genesis/index.md': `
---
title: Genesis
groupOrder: 1
summary: Origins, fault lines, the first tells
cover: ./cover.jpg
---
<Hero title="Genesis" image="./cover.jpg" />
<TextBlock>How the ground formed before it gave way.</TextBlock>
`.trim(),

  'content/crypto-high/sections/pandemic/index.md': `
---
title: Pandemic
groupOrder: 2
summary: The long weird season when reality blinked
cover: ./cover.jpg
---
<Hero title="Pandemic" image="./cover.jpg" />
<TextBlock>The room tilts. We learn new names for old fears.</TextBlock>
`.trim(),

  'content/crypto-high/sections/synthesis/index.md': `
---
title: Synthesis
groupOrder: 3
summary: Making a self from the wreckage and the grace
cover: ./cover.jpg
---
<Hero title="Synthesis" image="./cover.jpg" />
<TextBlock>What holds after the storm passes.</TextBlock>
`.trim(),

  // Genesis chapters
  'content/crypto-high/sections/genesis/christmas/index.md': `
---
title: Christmas
order: 1
summary: A holiday snapshot that reveals the fault lines.
cover: ./cover.jpg
---

# Christmas

<ImageBlock src="./cover.jpg" alt="Holiday lights across a dark room" />

<TextBlock>
First rituals, first tells. What joy hid and what it could not.
</TextBlock>
`.trim(),

  'content/crypto-high/sections/genesis/bully/index.md': `
---
title: The Bully
order: 2
summary: A bus fight that turns into a mirror.
cover: ./cover.jpg
---

# The Bully

<ImageBlock src="./cover.jpg" alt="School bus window in late sun" />

<TextBlock>
I thought I had an enemy. I met myself instead.
</TextBlock>
`.trim(),

  'content/crypto-high/sections/genesis/birth/index.md': `
---
title: Birth
order: 3
summary: A child helping a child arrive, and the room changes.
cover: ./cover.jpg
---

# Birth

<ImageBlock src="./cover.jpg" alt="Hand on a doorframe in a small apartment" />

<TextBlock>
Blood, breath, and the first real lesson in authority.
</TextBlock>
`.trim(),

  'content/crypto-high/sections/genesis/accidents/index.md': `
---
title: Accidents
order: 4
summary: When costume and consequence blur.
cover: ./cover.jpg
---

# Accidents

<ImageBlock src="./cover.jpg" alt="Headlights on wet asphalt at night" />

<TextBlock>
Impact arrives without permission. Memory learns to limp.
</TextBlock>
`.trim(),

  // Pandemic chapters
  'content/crypto-high/sections/pandemic/adrenaline/index.md': `
---
title: Adrenaline
order: 1
summary: The body floors it while the world stalls.
cover: ./cover.jpg
---

# Adrenaline

<ImageBlock src="./cover.jpg" alt="Empty streets and a racing heartbeat" />

<TextBlock>
Sirens outside, pulse inside. A fast engine in a parked car.
</TextBlock>
`.trim(),

  'content/crypto-high/sections/pandemic/weed/index.md': `
---
title: Weed
order: 2
summary: Small smoke, big weather.
cover: ./cover.jpg
---

# Weed

<ImageBlock src="./cover.jpg" alt="Curl of smoke in a shaft of light" />

<TextBlock>
Relief, ritual, and the edges that soften then sharpen.
</TextBlock>
`.trim(),

  'content/crypto-high/sections/pandemic/paranoia/index.md': `
---
title: Paranoia
order: 3
summary: The room tilts and the shadows learn names.
cover: ./cover.jpg
---

# Paranoia

<ImageBlock src="./cover.jpg" alt="Closed blinds and a watchful eye" />

<TextBlock>
What if becomes what is. Then it has to be argued back.
</TextBlock>
`.trim(),

  'content/crypto-high/sections/pandemic/crypto/index.md': `
---
title: Crypto
order: 4
summary: Numbers, faith, and a new kind of crowd noise.
cover: ./cover.jpg
---

# Crypto

<ImageBlock src="./cover.jpg" alt="Reflections of tickers in dark glasses" />

<TextBlock>
A rush of charts and promises. Signal, noise, and self.
</TextBlock>
`.trim(),

  // Synthesis chapters
  'content/crypto-high/sections/synthesis/feminism/index.md': `
---
title: Feminism
order: 1
summary: Power, care, and the terms that finally fit.
cover: ./cover.jpg
---

# Feminism

<ImageBlock src="./cover.jpg" alt="Notebook pages with underlined lines" />

<TextBlock>
New language, old truths. A better map for the body and the room.
</TextBlock>
`.trim(),

  'content/crypto-high/sections/synthesis/socialism/index.md': `
---
title: Socialism
order: 2
summary: The we that rebuilds the I.
cover: ./cover.jpg
---

# Socialism

<ImageBlock src="./cover.jpg" alt="Hands passing a folded flyer" />

<TextBlock>
Mutual aid and material facts. Less sermon, more soup.
</TextBlock>
`.trim(),

  'content/crypto-high/sections/synthesis/liberalism/index.md': `
---
title: Liberalism
order: 3
summary: Rights, limits, and what remains negotiable.
cover: ./cover.jpg
---

# Liberalism

<ImageBlock src="./cover.jpg" alt="Open door with afternoon light" />

<TextBlock>
Freedom with neighbors. Boundaries that breathe.
</TextBlock>
`.trim()
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function writeFileSafe(relPath, content) {
  const full = path.resolve(process.cwd(), relPath)
  await ensureDir(path.dirname(full))
  try {
    if (!FORCE) {
      await fs.access(full)
      console.log('skip', relPath)
      return
    }
  } catch (_) {
    // does not exist
  }
  await fs.writeFile(full, content, 'utf8')
  console.log('write', relPath)
}

async function run() {
  for (const [rel, content] of Object.entries(files)) {
    await writeFileSafe(rel, content.trim() + '\n')
  }
  // Placeholders for images the user will replace
  const imagePlaceholders = [
    'content/crypto-high/intro.jpg',
    'content/crypto-high/close.jpg',
    'content/crypto-high/specials/front/dedicated.jpg',
    'content/crypto-high/specials/end/afterward.jpg',
    'content/crypto-high/sections/genesis/cover.jpg',
    'content/crypto-high/sections/pandemic/cover.jpg',
    'content/crypto-high/sections/synthesis/cover.jpg',
    'content/crypto-high/sections/genesis/christmas/cover.jpg',
    'content/crypto-high/sections/genesis/bully/cover.jpg',
    'content/crypto-high/sections/genesis/birth/cover.jpg',
    'content/crypto-high/sections/genesis/accidents/cover.jpg',
    'content/crypto-high/sections/pandemic/adrenaline/cover.jpg',
    'content/crypto-high/sections/pandemic/weed/cover.jpg',
    'content/crypto-high/sections/pandemic/paranoia/cover.jpg',
    'content/crypto-high/sections/pandemic/crypto/cover.jpg',
    'content/crypto-high/sections/synthesis/feminism/cover.jpg',
    'content/crypto-high/sections/synthesis/socialism/cover.jpg',
    'content/crypto-high/sections/synthesis/liberalism/cover.jpg'
  ]
  for (const rel of imagePlaceholders) {
    const full = path.resolve(process.cwd(), rel)
    await ensureDir(path.dirname(full))
    try {
      await fs.access(full)
      continue
    } catch (_) {}
    await fs.writeFile(full, '', 'utf8')
    console.log('touch', rel)
  }

  console.log('\nDone. Replace the cover.jpg files with your images.')
  console.log('Start dev server: pnpm run dev')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
