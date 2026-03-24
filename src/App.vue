<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-app-bar-title>
        <v-icon icon="mdi-book-alphabet" class="mr-2" />
        Vocabulary Learning App
      </v-app-bar-title>
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

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="2000">
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVocabStore } from '@/stores/vocabStore'
import type { Vocabulary } from '@/types'
import VocabList from '@/components/VocabList.vue'
import QuizMode from '@/components/QuizMode.vue'
import AddVocabDialog from '@/components/AddVocabDialog.vue'
import StatsPanel from '@/components/StatsPanel.vue'

const store = useVocabStore()

const currentView = ref('list')
const dialogVisible = ref(false)
const selectedVocab = ref<Vocabulary | null>(null)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

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
</script>