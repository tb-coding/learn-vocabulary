<template>
  <v-card class="mb-3" variant="outlined">
    <v-card-title class="d-flex align-center">
      <span class="text-h6">{{ vocab.word }}</span>
      <v-spacer />
      <v-chip size="small" class="mr-2" v-for="tag in vocab.tags" :key="tag">
        {{ tag }}
      </v-chip>
    </v-card-title>
    <v-card-text>
      <p class="text-body-1">{{ vocab.definition }}</p>
      <div class="mt-2 text-caption text-medium-emphasis">
        Correct: {{ vocab.correctCount }} / Incorrect: {{ vocab.incorrectCount }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" variant="text" @click="$emit('edit', vocab)">
        Edit
      </v-btn>
      <v-btn color="error" variant="text" @click="$emit('delete', vocab.id)">
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Vocabulary } from '@/types'

defineOptions({ name: 'VocabCard' })

defineProps<{
  vocab: Vocabulary
}>()

defineEmits<{
  edit: [vocab: Vocabulary]
  delete: [id: string]
}>()
</script>