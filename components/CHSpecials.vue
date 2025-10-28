<script setup lang="ts">
const props = withDefaults(defineProps<{
  position: 'front' | 'end'
  title?: string
}>(), { title: undefined })

const base = `/crypto-high/specials/${props.position}`

const { data: specials } = await useAsyncData(
  `ch-specials-${props.position}`,
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
