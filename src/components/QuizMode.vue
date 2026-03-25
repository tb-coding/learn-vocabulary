<template>
  <div>
    <div v-if="!quizStarted" class="text-center py-8">
      <v-icon size="80" color="primary">mdi-head-question</v-icon>
      <h2 class="text-h5 mt-4 mb-6">Ready to test your knowledge?</h2>
      <p class="text-body-1 mb-6">
        You need at least 4 vocabulary words to start a quiz.
        <br />
        Current words: {{ store.vocabulary.length }}
      </p>
      <v-btn
        color="primary"
        size="large"
        :disabled="store.vocabulary.length < 4"
        @click="startQuiz"
      >
        Start Quiz
      </v-btn>
    </div>

    <div v-else-if="currentQuestion" class="quiz-container">
      <div class="d-flex align-center mb-6">
        <v-chip color="primary" variant="flat">
          Question {{ currentIndex + 1 }} / {{ questions.length }}
        </v-chip>
        <v-spacer />
        <v-chip :color="correctCount > incorrectCount ? 'success' : 'error'">
          Correct: {{ correctCount }} / Incorrect: {{ incorrectCount }}
        </v-chip>
      </div>

      <v-card variant="flat" class="mb-6 pa-6 bg-surface-variant">
        <p class="text-h6" style="white-space: pre-line;" v-html="questionText" />
      </v-card>

      <v-btn-toggle
        v-model="selectedAnswer"
        mandatory
        color="primary"
        class="flex-column align-stretch"
      >
        <v-btn
          v-for="option in currentQuestion.options"
          :key="option"
          :value="option"
          size="large"
          variant="outlined"
          class="mb-2"
          :color="getOptionColor(option)"
        >
          {{ option }}
        </v-btn>
      </v-btn-toggle>

      <div class="mt-6 d-flex">
        <v-btn
          v-if="!answered"
          color="primary"
          size="large"
          :disabled="!selectedAnswer"
          @click="submitAnswer"
        >
          Submit Answer
        </v-btn>

        <template v-else>
          <v-btn
            v-if="currentIndex < questions.length - 1"
            color="primary"
            size="large"
            @click="nextQuestion"
          >
            Next Question
          </v-btn>
          <v-btn
            v-else
            color="success"
            size="large"
            @click="finishQuiz"
          >
            Finish Quiz
          </v-btn>
        </template>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <v-icon size="80" color="success">mdi-check-circle</v-icon>
      <h2 class="text-h5 mt-4 mb-6">Quiz Complete!</h2>
      <div class="text-h3 mb-6">
        {{ correctCount }} / {{ questions.length }} Correct
      </div>
      <div class="text-h6 mb-6">
        Accuracy: {{ accuracy }}%
      </div>
      <v-btn color="primary" size="large" @click="startQuiz">
        Start Another Quiz
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVocabStore } from '@/stores/vocabStore'
import type { QuizQuestion } from '@/types'

defineOptions({ name: 'QuizMode' })

const store = useVocabStore()

const quizStarted = ref(false)
const questions = ref<QuizQuestion[]>([])
const currentIndex = ref(0)
const selectedAnswer = ref<string | null>(null)
const answered = ref(false)
const correctCount = ref(0)
const incorrectCount = ref(0)

const currentQuestion = computed(() => questions.value[currentIndex.value])
const questionText = computed(() => {
  if (!currentQuestion.value) return ''
  if (currentQuestion.value.type === 'word_to_definition') {
    return `What is the definition of "${currentQuestion.value.question}"?`
  }
  return `Which word matches this definition?\n"${currentQuestion.value.question}"`
})
const accuracy = computed(() => {
  const total = correctCount.value + incorrectCount.value
  if (total === 0) return 0
  return Math.round((correctCount.value / total) * 100)
})

function getOptionColor(option: string): string | undefined {
  if (!answered.value) return undefined
  if (option === currentQuestion.value.correctAnswer) return 'success'
  if (option === selectedAnswer.value && option !== currentQuestion.value.correctAnswer) return 'error'
  return undefined
}

function startQuiz() {
  questions.value = store.generateQuizQuestions(10)
  currentIndex.value = 0
  selectedAnswer.value = null
  answered.value = false
  correctCount.value = 0
  incorrectCount.value = 0
  quizStarted.value = true
}

function submitAnswer() {
  if (!selectedAnswer.value || answered.value) return

  answered.value = true
  const isCorrect = selectedAnswer.value === currentQuestion.value.correctAnswer

  if (isCorrect) {
    correctCount.value++
  } else {
    incorrectCount.value++
  }

  store.updateWordStats(currentQuestion.value.vocabId, isCorrect)
  store.recordQuizResult(isCorrect)
}

function nextQuestion() {
  currentIndex.value++
  selectedAnswer.value = null
  answered.value = false
}

function finishQuiz() {
  quizStarted.value = false
  questions.value = []
}
</script>

<style scoped>
.quiz-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>