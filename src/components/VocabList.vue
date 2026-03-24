<template>
  <div>
    <div class="d-flex align-center mb-4">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Search vocabulary"
        variant="outlined"
        density="compact"
        hide-details
        class="mr-4"
        style="max-width: 300px"
      />
      <v-select
        v-model="selectedTag"
        :items="allTags"
        label="Filter by tag"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        style="max-width: 200px"
      />
    </div>

    <div v-if="filteredVocabulary.length === 0" class="text-center py-8">
      <v-icon size="64" color="grey">mdi-book-open-page-variant</v-icon>
      <p class="text-h6 mt-4 text-grey">No vocabulary words yet</p>
      <p class="text-body-2 text-grey">Add your first word to get started!</p>
    </div>

    <div v-else>
      <VocabCard
        v-for="vocab in filteredVocabulary"
        :key="vocab.id"
        :vocab="vocab"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Vocabulary } from '@/types'
import VocabCard from './VocabCard.vue'

const props = defineProps<{
  vocabulary: Vocabulary[]
}>()

defineEmits<{
  edit: [vocab: Vocabulary]
  delete: [id: string]
}>()

const search = ref('')
const selectedTag = ref<string | null>(null)

const allTags = computed(() => {
  const tags = new Set<string>()
  props.vocabulary.forEach(v => v.tags.forEach(t => tags.add(t)))
  return Array.from(tags)
})

const filteredVocabulary = computed(() => {
  return props.vocabulary.filter(v => {
    const matchesSearch = v.word.toLowerCase().includes(search.value.toLowerCase()) ||
                          v.definition.toLowerCase().includes(search.value.toLowerCase())
    const matchesTag = !selectedTag.value || v.tags.includes(selectedTag.value)
    return matchesSearch && matchesTag
  })
})
</script>