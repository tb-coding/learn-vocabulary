<template>
  <v-overlay
    :model-value="visible"
    persistent
    class="align-center justify-center"
    scrim="rgba(0, 0, 0, 0.7)"
  >
    <v-card class="seed-loader-card pa-6" max-width="500" elevation="8">
      <v-card-title class="text-h5 mb-4 d-flex align-center">
        <v-icon icon="mdi-database-import" size="32" class="mr-3" color="primary" />
        Loading Vocabulary
      </v-card-title>

      <v-card-text>
        <div class="mb-4">
          <div class="d-flex justify-space-between mb-2">
            <span class="text-body-2 text-medium-emphasis">
              {{ progress.current }} / {{ progress.total }} words
            </span>
            <span class="text-body-2 font-weight-bold" :class="statusColor">
              {{ progressPercent }}%
            </span>
          </div>

          <v-progress-linear
            :model-value="progressPercent"
            :color="progressColor"
            height="12"
            rounded
            striped
            :stream="progress.status === 'fetching'"
          >
            <template #default>
              <span class="text-caption text-white">{{ currentStatusText }}</span>
            </template>
          </v-progress-linear>
        </div>

        <div v-if="progress.currentWord" class="mb-4">
          <v-chip size="small" color="secondary" variant="outlined">
            <v-icon start icon="mdi-format-letter-case" size="small" />
            {{ progress.currentWord }}
          </v-chip>
        </div>

        <div v-if="error" class="mb-4">
          <v-alert type="warning" variant="tonal" density="compact">
            {{ error }}
          </v-alert>
        </div>

        <div v-if="progress.status === 'complete'" class="text-center">
          <v-icon icon="mdi-check-circle" color="success" size="48" class="mb-2" />
          <div class="text-body-1 text-success font-weight-medium">
            Successfully loaded {{ progress.total }} vocabulary words!
          </div>
          <div v-if="loadedSource" class="text-body-2 text-medium-emphasis mt-1">
            Source: {{ loadedSource === 'api' ? 'Online Dictionary API' : 'Local Database' }}
          </div>
        </div>

        <div v-if="progress.status === 'fallback'" class="text-center">
          <v-icon icon="mdi-database" color="warning" size="48" class="mb-2" />
          <div class="text-body-1 text-warning font-weight-medium">
            Using offline vocabulary data
          </div>
          <div class="text-body-2 text-medium-emphasis mt-1">
            Some advanced features may be limited
          </div>
        </div>
      </v-card-text>

      <v-card-actions v-if="progress.status === 'complete' || progress.status === 'fallback'">
        <v-btn
          color="primary"
          size="large"
          block
          @click="$emit('complete')"
        >
          Start Learning
          <v-icon end icon="mdi-arrow-right" />
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FetchProgress } from '@/services/seedDataGenerator'

defineOptions({ name: 'SeedDataLoader' })

interface Props {
  visible: boolean
  progress: FetchProgress
  error?: string | null
  loadedSource?: 'api' | 'fallback' | null
}

const props = defineProps<Props>()

defineEmits<{
  complete: []
}>()

const progressPercent = computed(() => {
  if (props.progress.total === 0) return 0
  return Math.round((props.progress.current / props.progress.total) * 100)
})

const progressColor = computed(() => {
  switch (props.progress.status) {
    case 'complete':
      return 'success'
    case 'fallback':
      return 'warning'
    case 'enriched':
      return 'info'
    default:
      return 'primary'
  }
})

const statusColor = computed(() => {
  switch (props.progress.status) {
    case 'complete':
      return 'text-success'
    case 'fallback':
      return 'text-warning'
    default:
      return 'text-primary'
  }
})

const currentStatusText = computed(() => {
  switch (props.progress.status) {
    case 'idle':
      return 'Initializing...'
    case 'fetching':
      return `Fetching: ${props.progress.currentWord}`
    case 'enriched':
      return 'Vocabulary enriched!'
    case 'fallback':
      return 'Using offline data...'
    case 'complete':
      return 'Complete!'
    default:
      return ''
  }
})
</script>

<style scoped>
.seed-loader-card {
  border-radius: 16px;
}
</style>