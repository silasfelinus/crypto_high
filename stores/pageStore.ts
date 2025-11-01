// path: stores/pageStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { queryCollection as _queryCollection } from '#imports'

// Widen until Nuxt picks up content.config.ts and generates types
const queryCollection = _queryCollection as unknown as (name: string) => any

export interface PageMeta {
  title: string
  summary?: string
  cover?: string
  group?: string
  order?: number
  groupOrder?: number
  path: string
}

interface Doc {
  path: string
  title?: string
  summary?: string
  cover?: string
  order?: number
  groupOrder?: number
}

function inferGroup(path: string): string {
  const parts = path.split('/').filter(Boolean)
  const i = parts.indexOf('sections')
  const grp = i >= 0 ? parts[i + 1] : undefined
  return grp ?? 'specials-or-root'
}

export const usePageStore = defineStore('pageStore', () => {
  const pages = ref<PageMeta[]>([])
  const loading = ref(false)
  const initialized = ref(false)

  const ordered = computed(() =>
    [...pages.value].sort(
      (a, b) =>
        (a.groupOrder ?? 999) - (b.groupOrder ?? 999) ||
        (a.order ?? 999) - (b.order ?? 999) ||
        (a.title || '').localeCompare(b.title || '')
    )
  )

  const byGroup = (group: string) => pages.value.filter(p => p.group === group)

  async function init() {
    if (initialized.value || loading.value) return
    loading.value = true
    try {
      const docs = await queryCollection('content')       // ✅ correct key
        .where('path', 'LIKE', '/crypto-high/%')
        .select('path', 'title', 'summary', 'cover', 'order', 'groupOrder')
        .all()

      pages.value = (docs as Doc[]).map(d => ({
        title: d.title || 'Untitled',
        summary: d.summary,
        cover: d.cover,
        order: d.order,
        groupOrder: d.groupOrder,
        group: inferGroup(d.path),
        path: d.path
      }))

      initialized.value = true
    } catch (err) {
      console.error('pageStore init error:', err)
    } finally {
      loading.value = false
    }
  }

  function getByPath(path: string) {
    return pages.value.find(p => p.path === path)
  }
  function getNext(path: string) {
    const idx = ordered.value.findIndex(p => p.path === path)
    return idx >= 0 ? ordered.value[idx + 1] : undefined
  }
  function getPrev(path: string) {
    const idx = ordered.value.findIndex(p => p.path === path)
    return idx > 0 ? ordered.value[idx - 1] : undefined
  }
  function reset() {
    pages.value = []
    loading.value = false
    initialized.value = false
  }

  const _meta = import.meta as any
  if (_meta?.hot) {
    _meta.hot.accept(() => null)
    _meta.hot.dispose(() => reset())
  }

  return { pages, loading, initialized, ordered, byGroup, init, getByPath, getNext, getPrev, reset }
})
