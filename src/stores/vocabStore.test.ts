import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useVocabStore } from '@/stores/vocabStore'

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key]
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {}
  })
}

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock
})

describe('vocabStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
  })

  describe('addWord', () => {
    it('should add a new vocabulary word', () => {
      const store = useVocabStore()
      
      const word = store.addWord('hello', 'a greeting', ['greeting'])
      
      expect(word.word).toBe('hello')
      expect(word.definition).toBe('a greeting')
      expect(word.tags).toEqual(['greeting'])
      expect(word.id).toBeDefined()
      expect(store.vocabulary.length).toBe(1)
    })

    it('should update totalWords stat when adding', () => {
      const store = useVocabStore()
      
      store.addWord('test', 'a test word', [])
      
      expect(store.stats.totalWords).toBe(1)
    })
  })

  describe('deleteWord', () => {
    it('should remove a vocabulary word', () => {
      const store = useVocabStore()
      
      const word = store.addWord('test', 'test definition', [])
      store.deleteWord(word.id)
      
      expect(store.vocabulary.length).toBe(0)
    })
  })

  describe('updateWord', () => {
    it('should update an existing vocabulary word', () => {
      const store = useVocabStore()
      
      const word = store.addWord('original', 'original definition', [])
      store.updateWord(word.id, 'updated', 'updated definition', ['new'])
      
      const updated = store.getWord(word.id)
      expect(updated?.word).toBe('updated')
      expect(updated?.definition).toBe('updated definition')
    })
  })

  describe('generateQuizQuestions', () => {
    it('should return empty array when less than 4 words', () => {
      const store = useVocabStore()
      
      store.addWord('word1', 'def1', [])
      store.addWord('word2', 'def2', [])
      
      const questions = store.generateQuizQuestions()
      expect(questions.length).toBe(0)
    })

    it('should generate questions when enough words exist', () => {
      const store = useVocabStore()
      
      store.addWord('word1', 'def1', [])
      store.addWord('word2', 'def2', [])
      store.addWord('word3', 'def3', [])
      store.addWord('word4', 'def4', [])
      
      const questions = store.generateQuizQuestions(2)
      expect(questions.length).toBe(2)
      expect(questions[0].options.length).toBe(4) // 3 wrong + 1 correct
    })
  })

  describe('isFirstLaunch', () => {
    it('should return true when vocabulary is empty', () => {
      const store = useVocabStore()
      
      expect(store.isFirstLaunch).toBe(true)
    })

    it('should return false when vocabulary exists', () => {
      const store = useVocabStore()
      
      store.addWord('test', 'test', [])
      
      expect(store.isFirstLaunch).toBe(false)
    })
  })
})