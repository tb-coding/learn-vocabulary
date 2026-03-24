import { ref, computed } from 'vue'
import { useVocabStore } from '@/stores/vocabStore'
import { useSeedDataGenerator, type SeedWordDetail, type FetchProgress } from '@/services/seedDataGenerator'

export function useSeedData() {
  const store = useVocabStore()
  const { enrichSeedWords, getSeedWords } = useSeedDataGenerator()

  const isLoading = ref(false)
  const loadingProgress = ref<FetchProgress>({
    current: 0,
    total: 0,
    currentWord: '',
    status: 'idle'
  })
  const error = ref<string | null>(null)
  const lastLoadedAt = ref<number | null>(null)
  const loadedSource = ref<'api' | 'fallback' | null>(null)

  const progressPercent = computed(() => {
    if (loadingProgress.value.total === 0) return 0
    return Math.round((loadingProgress.value.current / loadingProgress.value.total) * 100)
  })

  const isComplete = computed(() => loadingProgress.value.status === 'complete')
  const isEnriched = computed(() => loadingProgress.value.status === 'enriched')
  const isUsingFallback = computed(() => loadingProgress.value.status === 'fallback')

  async function loadSeedData() {
    if (isLoading.value) return
    if (store.vocabulary.length > 0) return

    isLoading.value = true
    error.value = null
    loadingProgress.value = {
      current: 0,
      total: 100,
      currentWord: '',
      status: 'fetching'
    }

    try {
      const { words, source } = await enrichSeedWords((progress) => {
        loadingProgress.value = progress
      })

      const vocabItems = words.map((word: SeedWordDetail) => ({
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        word: word.word,
        definition: word.definition || `${word.partOfSpeech || 'word'}: ${word.synonyms?.join(', ') || 'common vocabulary'}`,
        tags: [word.category, word.difficulty],
        createdAt: Date.now(),
        correctCount: 0,
        incorrectCount: 0,
        source: source as 'api' | 'fallback',
        phonetic: word.phonetic,
        examples: word.examples,
        synonyms: word.synonyms
      }))

      for (const item of vocabItems) {
        store.addWordFromSeed(item)
      }

      lastLoadedAt.value = Date.now()
      loadedSource.value = source

      loadingProgress.value = {
        ...loadingProgress.value,
        status: 'complete'
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load seed data'

      const fallbackWords = getSeedWords()
      const vocabItems = fallbackWords.map((word) => ({
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        word: word.word,
        definition: word.definition,
        tags: [word.category, word.difficulty],
        createdAt: Date.now(),
        correctCount: 0,
        incorrectCount: 0,
        source: 'fallback' as const
      }))

      for (const item of vocabItems) {
        store.addWordFromSeed(item)
      }

      lastLoadedAt.value = Date.now()
      loadedSource.value = 'fallback'

      loadingProgress.value = {
        ...loadingProgress.value,
        status: 'fallback',
        error: error.value
      }
    } finally {
      isLoading.value = false
    }
  }

  async function reloadSeedData() {
    store.clearVocabulary()
    await loadSeedData()
  }

  function shouldShowLoader(): boolean {
    return store.vocabulary.length === 0 && !isComplete.value
  }

  return {
    isLoading,
    loadingProgress,
    error,
    lastLoadedAt,
    loadedSource,
    progressPercent,
    isComplete,
    isEnriched,
    isUsingFallback,
    shouldShowLoader,
    loadSeedData,
    reloadSeedData
  }
}