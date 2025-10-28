<script setup lang="ts">
const props = defineProps<{ height?: string }>()
</script>
<template>
  <div class="w-full bg-gray-200 animate-pulse rounded not-prose" :style="{ height: props.height || '120px' }" />
</template>
