<script setup lang="ts">
const props = defineProps<{ src: string; alt?: string; caption?: string }>()
</script>

<template>
  <figure class="space-y-2 not-prose">
    <img :src="props.src" :alt="props.alt || ''" class="w-full rounded object-cover" />
    <figcaption v-if="props.caption" class="text-sm text-gray-500">{{ props.caption }}</figcaption>
  </figure>
</template>
