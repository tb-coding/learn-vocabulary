import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getSeedWords, getWordsByCategory, getWordsByDifficulty, getRandomWords, getCategoryStats, getDifficultyDistribution, fetchWordDetails } from '@/services/seedDataGenerator'

describe('seedDataGenerator', () => {
  describe('getSeedWords', () => {
    it('should return an array of seed words', () => {
      const words = getSeedWords()
      
      expect(Array.isArray(words)).toBe(true)
      expect(words.length).toBeGreaterThan(0)
    })

    it('should return words with required properties', () => {
      const words = getSeedWords()
      
      words.forEach(word => {
        expect(word).toHaveProperty('word')
        expect(word).toHaveProperty('definition')
        expect(word).toHaveProperty('category')
        expect(word).toHaveProperty('difficulty')
      })
    })
  })

  describe('getWordsByCategory', () => {
    it('should return words filtered by category', () => {
      const foodWords = getWordsByCategory('food')
      
      foodWords.forEach(word => {
        expect(word.category).toBe('food')
      })
    })

    it('should return empty array for unknown category', () => {
      const unknownWords = getWordsByCategory('unknown')
      
      expect(unknownWords.length).toBe(0)
    })
  })

  describe('getWordsByDifficulty', () => {
    it('should return words filtered by difficulty', () => {
      const easyWords = getWordsByDifficulty('easy')
      
      easyWords.forEach(word => {
        expect(word.difficulty).toBe('easy')
      })
    })
  })

  describe('getRandomWords', () => {
    it('should return requested number of words', () => {
      const words = getRandomWords(5)
      
      expect(words.length).toBe(5)
    })

    it('should return all words if count exceeds total', () => {
      const totalWords = getSeedWords().length
      const words = getRandomWords(totalWords + 100)
      
      expect(words.length).toBe(totalWords)
    })
  })

  describe('getCategoryStats', () => {
    it('should return category word counts', () => {
      const stats = getCategoryStats()
      
      expect(stats).toHaveProperty('food')
      expect(stats).toHaveProperty('travel')
      expect(stats).toHaveProperty('work')
    })
  })

  describe('getDifficultyDistribution', () => {
    it('should return difficulty distribution percentages', () => {
      const dist = getDifficultyDistribution()
      
      expect(dist.easy).toBe(0.4)
      expect(dist.medium).toBe(0.45)
      expect(dist.hard).toBe(0.15)
    })
  })

  describe('fetchWordDetails', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return null for non-existent word', async () => {
      // Using a word that doesn't exist in the dictionary
      const result = await fetchWordDetails('nonexistentword12345')
      
      expect(result).toBeNull()
    })

    it('should handle API errors gracefully', async () => {
      // Mock fetch to throw an error
      const originalFetch = globalThis.fetch
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const result = await fetchWordDetails('test')
      
      expect(result).toBeNull()

      globalThis.fetch = originalFetch
    })
  })
})