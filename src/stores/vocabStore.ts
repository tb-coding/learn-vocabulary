import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Vocabulary, QuizQuestion, Stats, SeedVocabularyInput } from '@/types'

const STORAGE_KEY = 'vocab-app-data'

function generateId(): string {
  return crypto.randomUUID()
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export const useVocabStore = defineStore('vocab', () => {
  const vocabulary = ref<Vocabulary[]>([])
  const stats = ref<Stats>({
    totalWords: 0,
    totalQuizzes: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    streak: 0,
    lastStudyDate: null
  })

  function loadFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      vocabulary.value = data.vocabulary || []
      stats.value = data.stats || {
        totalWords: 0,
        totalQuizzes: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        streak: 0,
        lastStudyDate: null
      }
    }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      vocabulary: vocabulary.value,
      stats: stats.value
    }))
  }

  function addWord(word: string, definition: string, tags: string[], source: Vocabulary['source'] = 'user') {
    const newVocab: Vocabulary = {
      id: generateId(),
      word,
      definition,
      tags,
      createdAt: Date.now(),
      correctCount: 0,
      incorrectCount: 0,
      source
    }
    vocabulary.value.push(newVocab)
    stats.value.totalWords = vocabulary.value.length
    saveToStorage()
    return newVocab
  }

  function addWordFromSeed(input: SeedVocabularyInput) {
    const newVocab: Vocabulary = {
      id: generateId(),
      word: input.word,
      definition: input.definition,
      tags: input.tags,
      createdAt: Date.now(),
      correctCount: 0,
      incorrectCount: 0,
      source: input.source,
      phonetic: input.phonetic,
      examples: input.examples,
      synonyms: input.synonyms
    }
    vocabulary.value.push(newVocab)
    stats.value.totalWords = vocabulary.value.length
    saveToStorage()
    return newVocab
  }

  function updateWord(id: string, word: string, definition: string, tags: string[]) {
    const idx = vocabulary.value.findIndex(v => v.id === id)
    if (idx !== -1) {
      vocabulary.value[idx] = { ...vocabulary.value[idx], word, definition, tags }
      saveToStorage()
    }
  }

  function deleteWord(id: string) {
    vocabulary.value = vocabulary.value.filter(v => v.id !== id)
    stats.value.totalWords = vocabulary.value.length
    saveToStorage()
  }

  function clearVocabulary() {
    vocabulary.value = []
    stats.value.totalWords = 0
    saveToStorage()
  }

  function getWord(id: string): Vocabulary | undefined {
    return vocabulary.value.find(v => v.id === id)
  }

  function updateWordStats(id: string, correct: boolean) {
    const vocab = vocabulary.value.find(v => v.id === id)
    if (vocab) {
      if (correct) {
        vocab.correctCount++
      } else {
        vocab.incorrectCount++
      }
      saveToStorage()
    }
  }

  function generateQuizQuestions(count: number = 10): QuizQuestion[] {
    if (vocabulary.value.length < 4) return []

    const questions: QuizQuestion[] = []
    const today = getToday()

    // Update streak
    if (stats.value.lastStudyDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      if (stats.value.lastStudyDate === yesterdayStr) {
        stats.value.streak++
      } else if (stats.value.lastStudyDate !== today) {
        stats.value.streak = 1
      }
      stats.value.lastStudyDate = today
    }

    const shuffled = [...vocabulary.value].sort(() => Math.random() - 0.5)
    const questionCount = Math.min(count, shuffled.length)

    for (let i = 0; i < questionCount; i++) {
      const vocab = shuffled[i]
      const type = Math.random() > 0.5 ? 'word_to_definition' : 'definition_to_word'

      // Get 3 wrong options
      const wrongOptions = vocabulary.value
        .filter(v => v.id !== vocab.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(v => type === 'word_to_definition' ? v.definition : v.word)

      const correctAnswer = type === 'word_to_definition' ? vocab.definition : vocab.word

      questions.push({
        id: generateId(),
        type,
        question: type === 'word_to_definition' ? vocab.word : vocab.definition,
        correctAnswer,
        options: [...wrongOptions, correctAnswer].sort(() => Math.random() - 0.5),
        vocabId: vocab.id
      })
    }

    return questions
  }

  function recordQuizResult(correct: boolean) {
    stats.value.totalQuizzes++
    if (correct) {
      stats.value.correctAnswers++
    } else {
      stats.value.incorrectAnswers++
    }
    saveToStorage()
  }

  const accuracyRate = computed(() => {
    const total = stats.value.correctAnswers + stats.value.incorrectAnswers
    if (total === 0) return 0
    return Math.round((stats.value.correctAnswers / total) * 100)
  })

  const hasSeedData = computed(() => {
    return vocabulary.value.some(v => v.source === 'api' || v.source === 'fallback')
  })

  const isFirstLaunch = computed(() => {
    return vocabulary.value.length === 0
  })

  const seedWordCount = computed(() => {
    return vocabulary.value.filter(v => v.source === 'api' || v.source === 'fallback').length
  })

  // Initialize from storage
  loadFromStorage()

  return {
    vocabulary,
    stats,
    accuracyRate,
    hasSeedData,
    isFirstLaunch,
    seedWordCount,
    addWord,
    addWordFromSeed,
    updateWord,
    deleteWord,
    clearVocabulary,
    getWord,
    updateWordStats,
    generateQuizQuestions,
    recordQuizResult,
    loadFromStorage
  }
})