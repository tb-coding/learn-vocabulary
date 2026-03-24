export interface Vocabulary {
  id: string
  word: string
  definition: string
  tags: string[]
  createdAt: number
  correctCount: number
  incorrectCount: number
  source?: 'user' | 'api' | 'fallback'
  phonetic?: string
  examples?: string[]
  synonyms?: string[]
}

export interface SeedVocabularyInput {
  word: string
  definition: string
  tags: string[]
  source: 'api' | 'fallback'
  phonetic?: string
  examples?: string[]
  synonyms?: string[]
}

export interface QuizQuestion {
  id: string
  type: 'word_to_definition' | 'definition_to_word'
  question: string
  correctAnswer: string
  options: string[]
  vocabId: string
}

export interface Stats {
  totalWords: number
  totalQuizzes: number
  correctAnswers: number
  incorrectAnswers: number
  streak: number
  lastStudyDate: string | null
}