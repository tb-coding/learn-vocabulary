<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-app-bar-title>
        <v-icon icon="mdi-book-alphabet" class="mr-2" />
        Vocabulary Learning App
      </v-app-bar-title>
      <v-btn icon variant="text" @click="showSettings = true">
        <v-icon icon="mdi-cog" />
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <v-row>
          <v-col cols="12" md="4" order="2">
            <StatsPanel class="mb-4" />
            <v-btn
              color="primary"
              size="large"
              block
              class="mb-4"
              prepend-icon="mdi-plus"
              @click="openAddDialog"
            >
              Add Vocabulary
            </v-btn>
            <v-btn
              color="secondary"
              size="large"
              block
              prepend-icon="mdi-head-question"
              @click="currentView = 'quiz'"
              v-if="store.vocabulary.length >= 4"
            >
              Take Quiz
            </v-btn>
          </v-col>

          <v-col cols="12" md="8" order="1">
            <v-tabs v-model="currentView" color="primary" class="mb-4">
              <v-tab value="list">
                <v-icon start>mdi-format-list-bulleted</v-icon>
                Vocabulary List
              </v-tab>
              <v-tab value="quiz">
                <v-icon start>mdi-head-question</v-icon>
                Quiz Mode
              </v-tab>
            </v-tabs>

            <v-tabs-window v-model="currentView">
              <v-tabs-window-item value="list">
                <VocabList
                  :vocabulary="store.vocabulary"
                  @edit="openEditDialog"
                  @delete="handleDelete"
                />
              </v-tabs-window-item>
              <v-tabs-window-item value="quiz">
                <QuizMode />
              </v-tabs-window-item>
            </v-tabs-window>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <AddVocabDialog
      v-model="dialogVisible"
      :vocab="selectedVocab"
      @save="handleSave"
    />

    <v-dialog v-model="showSettings" max-width="400">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon icon="mdi-cog" class="mr-2" />
          Settings
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <template #prepend>
                <v-icon icon="mdi-database" />
              </template>
              <v-list-item-title>Total Vocabulary</v-list-item-title>
              <v-list-item-subtitle>{{ store.vocabulary.length }} words</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="store.seedWordCount > 0">
              <template #prepend>
                <v-icon icon="mdi-seed" />
              </template>
              <v-list-item-title>Seed Data</v-list-item-title>
              <v-list-item-subtitle>{{ store.seedWordCount }} words loaded</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-divider class="my-3" />
          <v-btn
            color="warning"
            variant="outlined"
            block
            prepend-icon="mdi-refresh"
            @click="handleResetSeedData"
          >
            Reset to Seed Data
          </v-btn>
          <v-alert
            v-if="showResetWarning"
            type="warning"
            variant="tonal"
            class="mt-3"
            density="compact"
          >
            This will replace all your vocabulary with the seed data. This action cannot be undone.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showSettings = false; showResetWarning = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <SeedDataLoader
      :visible="showSeedLoader"
      :progress="loadingProgress"
      :error="error"
      :loaded-source="loadedSource"
      @complete="handleSeedComplete"
    />

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="2000">
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVocabStore } from '@/stores/vocabStore'
import { useSeedData } from '@/composables/useSeedData'
import type { Vocabulary } from '@/types'
import VocabList from '@/components/VocabList.vue'
import QuizMode from '@/components/QuizMode.vue'
import AddVocabDialog from '@/components/AddVocabDialog.vue'
import StatsPanel from '@/components/StatsPanel.vue'
import SeedDataLoader from '@/components/SeedDataLoader.vue'

const store = useVocabStore()
const {
  loadingProgress,
  error,
  loadedSource,
  loadSeedData,
  reloadSeedData
} = useSeedData()

const currentView = ref('list')
const dialogVisible = ref(false)
const selectedVocab = ref<Vocabulary | null>(null)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const showSettings = ref(false)
const showResetWarning = ref(false)
const showSeedLoader = ref(false)

onMounted(async () => {
  if (store.isFirstLaunch) {
    showSeedLoader.value = true
    await loadSeedData()
  }
})

function openAddDialog() {
  selectedVocab.value = null
  dialogVisible.value = true
}

function openEditDialog(vocab: Vocabulary) {
  selectedVocab.value = vocab
  dialogVisible.value = true
}

function handleSave(data: { word: string; definition: string; tags: string[] }) {
  if (selectedVocab.value) {
    store.updateWord(selectedVocab.value.id, data.word, data.definition, data.tags)
    showSnackbar('Vocabulary updated successfully')
  } else {
    store.addWord(data.word, data.definition, data.tags)
    showSnackbar('Vocabulary added successfully')
  }
}

function handleDelete(id: string) {
  store.deleteWord(id)
  showSnackbar('Vocabulary deleted', 'error')
}

function showSnackbar(text: string, color = 'success') {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

function handleSeedComplete() {
  showSeedLoader.value = false
  showSnackbar('Seed data loaded successfully!')
}

async function handleResetSeedData() {
  if (!showResetWarning.value) {
    showResetWarning.value = true
    return
  }
  showResetWarning.value = false
  showSettings.value = false
  showSeedLoader.value = true
  await reloadSeedData()
}
</script>