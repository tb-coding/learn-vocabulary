<template>
  <v-card variant="outlined" class="pa-4">
    <v-card-title class="text-h6 mb-4">Study Statistics</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6" sm="3">
          <div class="text-center">
            <v-icon size="40" color="primary">mdi-book-alphabet</v-icon>
            <div class="text-h4 mt-2">{{ store.vocabulary.length }}</div>
            <div class="text-caption text-grey">Total Words</div>
          </div>
        </v-col>
        <v-col cols="6" sm="3">
          <div class="text-center">
            <v-icon size="40" color="success">mdi-check-circle</v-icon>
            <div class="text-h4 mt-2">{{ store.stats.totalQuizzes }}</div>
            <div class="text-caption text-grey">Quizzes Taken</div>
          </div>
        </v-col>
        <v-col cols="6" sm="3">
          <div class="text-center">
            <v-icon size="40" color="info">mdi-percent</v-icon>
            <div class="text-h4 mt-2">{{ store.accuracyRate }}%</div>
            <div class="text-caption text-grey">Accuracy</div>
          </div>
        </v-col>
        <v-col cols="6" sm="3">
          <div class="text-center">
            <v-icon size="40" color="warning">mdi-fire</v-icon>
            <div class="text-h4 mt-2">{{ store.stats.streak }}</div>
            <div class="text-caption text-grey">Day Streak</div>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <div class="mb-4">
        <div class="text-subtitle-2 mb-2">Answer Breakdown</div>
        <div class="d-flex align-center">
          <v-icon size="20" color="success" class="mr-2">mdi-check</v-icon>
          <span class="mr-4">Correct: {{ store.stats.correctAnswers }}</span>
          <v-icon size="20" color="error" class="mr-2">mdi-close</v-icon>
          <span>Incorrect: {{ store.stats.incorrectAnswers }}</span>
        </div>
      </div>

      <div v-if="store.stats.lastStudyDate" class="text-caption text-grey">
        Last studied: {{ store.stats.lastStudyDate }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useVocabStore } from '@/stores/vocabStore'

defineOptions({ name: 'StatsPanel' })

const store = useVocabStore()
</script>