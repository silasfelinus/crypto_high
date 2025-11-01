<!-- /pages/[...slug].vue -->
<template>
  <NuxtLayout>
    <div v-if="doc">
      <ContentRenderer :value="doc" />
    </div>
    <template #fallback>
      <Icon name="kind-icon:loading" class="w-10 h-10 text-info" />
      <p class="text-center text-base text-info p-4">Loading page...</p>
    </template>
  </NuxtLayout>
  <error-popup />
</template>

<script setup lang="ts">
import { usePageStore } from '~/stores/pageStore'
import { useRoute, computed, useAsyncData } from '#imports'
import { queryCollection as _queryCollection } from '#imports'

// TEMP widen until Nuxt generates the union type for collections
const queryCollection = _queryCollection as unknown as (name: string) => any

const route = useRoute()

const path = computed(() => {
  const slug = route.params.slug
  return '/' + (Array.isArray(slug) ? slug.join('/') : (slug ?? ''))
})

const { data: doc } = await useAsyncData(
  () => 'doc:' + path.value,
  () =>
    queryCollection('content') // your collection key
      .where('path', '=', path.value) // match the file’s path
      .first() // single doc
)

// Warm the TOC/index elsewhere
const pageStore = usePageStore()
await pageStore.init()
</script>
