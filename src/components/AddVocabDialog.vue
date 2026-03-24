<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="text-h5 pa-4">
        {{ isEditing ? 'Edit Vocabulary' : 'Add Vocabulary' }}
      </v-card-title>
      <v-card-text class="pa-4 pt-0">
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-text-field
            v-model="formData.word"
            label="Word"
            variant="outlined"
            :rules="[rules.required]"
            class="mb-3"
          />
          <v-textarea
            v-model="formData.definition"
            label="Definition"
            variant="outlined"
            rows="3"
            :rules="[rules.required]"
            class="mb-3"
          />
          <v-combobox
            v-model="formData.tags"
            label="Tags (press enter to add)"
            variant="outlined"
            multiple
            chips
            closable-chips
            clearable
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" variant="flat" @click="submit" :disabled="!valid">
          {{ isEditing ? 'Save' : 'Add' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { Vocabulary } from '@/types'

const props = defineProps<{
  modelValue: boolean
  vocab?: Vocabulary | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [data: { word: string; definition: string; tags: string[] }]
}>()

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const isEditing = computed(() => !!props.vocab)

const valid = ref(false)

const formData = reactive({
  word: '',
  definition: '',
  tags: [] as string[]
})

const rules = {
  required: (v: string) => !!v || 'This field is required'
}

watch(() => props.modelValue, (val) => {
  if (val) {
    if (props.vocab) {
      formData.word = props.vocab.word
      formData.definition = props.vocab.definition
      formData.tags = [...props.vocab.tags]
    } else {
      formData.word = ''
      formData.definition = ''
      formData.tags = []
    }
  }
})

function close() {
  dialog.value = false
}

function submit() {
  if (valid.value) {
    emit('save', {
      word: formData.word.trim(),
      definition: formData.definition.trim(),
      tags: formData.tags.map(t => t.trim()).filter(Boolean)
    })
    close()
  }
}
</script>