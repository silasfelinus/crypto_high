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
      const g = groups.get(groupSlug) || { _path: `/crypto-high/sections/${groupSlug}`, title: groupSlug, children: [] }
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
