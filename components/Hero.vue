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
