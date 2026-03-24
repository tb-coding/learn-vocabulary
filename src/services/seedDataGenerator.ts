import seedWordsData from '@/data/seed-words.json'

export interface SeedWord {
  word: string
  definition: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface SeedWordDetail extends SeedWord {
  phonetic?: string
  partOfSpeech?: string
  examples?: string[]
  synonyms?: string[]
}

export interface FetchProgress {
  current: number
  total: number
  currentWord: string
  status: 'idle' | 'fetching' | 'enriched' | 'fallback' | 'complete'
  error?: string
}

const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en'

const CATEGORY_WORD_COUNTS: Record<string, number> = {
  food: 20,
  travel: 20,
  work: 20,
  emotions: 15,
  daily: 15,
  technology: 10
}

const DIFFICULTY_DISTRIBUTION = {
  easy: 0.4,
  medium: 0.45,
  hard: 0.15
}

export function getSeedWords(): SeedWord[] {
  return seedWordsData.words as SeedWord[]
}

export function getWordsByCategory(category: string): SeedWord[] {
  return getSeedWords().filter(w => w.category === category)
}

export function getWordsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): SeedWord[] {
  return getSeedWords().filter(w => w.difficulty === difficulty)
}

export function getRandomWords(count: number): SeedWord[] {
  const words = [...getSeedWords()]
  const shuffled = words.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getCategoryStats() {
  return CATEGORY_WORD_COUNTS
}

export function getDifficultyDistribution() {
  return DIFFICULTY_DISTRIBUTION
}

const REQUEST_TIMEOUT_MS = 10000 // 10 seconds timeout

export async function fetchWordDetails(word: string): Promise<SeedWordDetail | null> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE}/${encodeURIComponent(word)}`, {
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    if (!Array.isArray(data) || data.length === 0) {
      return null
    }

    const entry = data[0]
    const meanings = entry.meanings || []

    let phonetic = entry.phonetic || ''
    if (!phonetic && entry.phonetics && entry.phonetics.length > 0) {
      phonetic = entry.phonetics.find((p: { text?: string }) => p.text)?.text || ''
    }

    let partOfSpeech = ''
    let examples: string[] = []
    let synonyms: string[] = []

    if (meanings.length > 0) {
      const firstMeaning = meanings[0]
      partOfSpeech = firstMeaning.partOfSpeech || ''

      const defs = firstMeaning.definitions || []
      if (defs.length > 0) {
        const firstDef = defs[0]
        if (firstDef.example) {
          examples.push(firstDef.example)
        }
        if (firstDef.synonyms && firstDef.synonyms.length > 0) {
          synonyms = firstDef.synonyms.slice(0, 3)
        }
      }

      for (let i = 1; i < meanings.length && synonyms.length < 3; i++) {
        const syns = meanings[i].definitions?.flatMap((d: { synonyms?: string[] }) => d.synonyms || []) || []
        synonyms = [...synonyms, ...syns].slice(0, 3)
      }
    }

    return {
      word: entry.word || word,
      definition: '',
      category: '',
      difficulty: 'medium',
      phonetic,
      partOfSpeech,
      examples,
      synonyms
    }
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`Request timeout for word: ${word}`)
    }
    return null
  }
}

export async function enrichSeedWords(
  onProgress?: (progress: FetchProgress) => void
): Promise<{ words: SeedWordDetail[]; source: 'api' | 'fallback' }> {
  const words = getSeedWords()
  const enrichedWords: SeedWordDetail[] = []
  let apiSuccessCount = 0

  for (let i = 0; i < words.length; i++) {
    const word = words[i]

    onProgress?.({
      current: i + 1,
      total: words.length,
      currentWord: word.word,
      status: 'fetching'
    })

    const details = await fetchWordDetails(word.word)

    if (details) {
      apiSuccessCount++
      enrichedWords.push({
        ...word,
        phonetic: details.phonetic,
        partOfSpeech: details.partOfSpeech,
        examples: details.examples,
        synonyms: details.synonyms
      })
    } else {
      enrichedWords.push({
        ...word,
        definition: word.definition
      })
    }

    await new Promise(resolve => setTimeout(resolve, 100))
  }

  const source = apiSuccessCount > words.length * 0.5 ? 'api' : 'fallback'

  onProgress?.({
    current: words.length,
    total: words.length,
    currentWord: '',
    status: source === 'api' ? 'enriched' : 'fallback',
    error: source === 'fallback' ? `Only ${apiSuccessCount}/${words.length} words enriched from API` : undefined
  })

  return { words: enrichedWords, source }
}

export function useSeedDataGenerator() {
  return {
    getSeedWords,
    getWordsByCategory,
    getWordsByDifficulty,
    getRandomWords,
    getCategoryStats,
    getDifficultyDistribution,
    fetchWordDetails,
    enrichSeedWords
  }
}