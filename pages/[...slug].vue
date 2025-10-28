<script setup lang="ts">
import { useRoute } from 'nuxt/app';


const route = useRoute()
const path = '/' + (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug || '')
</script>

<template>
  <main class="container mx-auto p-6 prose max-w-none">
    <ContentDoc :path="path" />
  </main>
</template>
