# Learn Vocabulary - Technical Specification

## Project Overview
A Vue 3 + Vite + Vuetify vocabulary learning application with quiz functionality and progress tracking.

## Features

### MVP Features
1. **Vocabulary Management**
   - Add new words with definitions
   - Edit existing vocabulary
   - Delete words
   - Categorize by tags

2. **Quiz Mode**
   - Multiple choice questions
   - Definition-to-word matching
   - Word-to-definition matching
   - Progress tracking per session

3. **Progress Tracking**
   - Statistics dashboard
   - Words learned count
   - Quiz accuracy rate
   - Study streak

4. **Data Management**
   - localStorage persistence
   - Export/Import JSON
   - Sample data for testing

## Technical Architecture

### Project Structure
```
src/
├── components/
│   ├── VocabList.vue       # Vocabulary list view
│   ├── VocabCard.vue       # Single word card
│   ├── QuizMode.vue        # Quiz interface
│   ├── AddVocabDialog.vue  # Add word dialog
│   └── StatsPanel.vue      # Statistics display
├── composables/
│   ├── useVocab.js         # Vocabulary management
│   ├── useQuiz.js          # Quiz logic
│   └── useStorage.js       # localStorage wrapper
├── views/
│   ├── HomeView.vue        # Main dashboard
│   ├── VocabView.vue       # Vocabulary management
│   └── QuizView.vue        # Quiz page
├── stores/
│   └── vocabStore.js       # Pinia store
├── App.vue
└── main.js
```

### Component Specifications

#### VocabList.vue
- Display vocabulary in card grid
- Search/filter functionality
- Tag filtering
- Edit/Delete actions

#### QuizMode.vue
- Question display
- Answer options (4 choices)
- Score tracking
- Progress bar
- Result summary

#### StatsPanel.vue
- Total words count
- Quiz accuracy percentage
- Study streak counter
- Words mastered count

### Data Model
```typescript
interface Vocabulary {
  id: string;
  word: string;
  definition: string;
  example?: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  mastered: boolean;
  createdAt: Date;
}

interface QuizResult {
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
  completedAt: Date;
}
```

### UI/UX Specifications
- Theme: Light/Dark mode toggle
- Primary color: Indigo (#6366f1)
- Card-based layout
- Smooth transitions (300ms)
- Toast notifications for feedback

### Responsive Breakpoints
- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop: > 960px

## Implementation Phases

### Phase 1: Setup (30 min)
- Initialize Vite + Vue 3 project
- Install Vuetify, Pinia
- Configure ESLint, Prettier
- Setup project structure

### Phase 2: Core Features (2 hours)
- Vocabulary management (CRUD)
- localStorage persistence
- Basic UI components

### Phase 3: Quiz System (1.5 hours)
- Quiz generation logic
- Answer validation
- Score tracking

### Phase 4: Polish (1 hour)
- Statistics dashboard
- Animations
- Error handling
- Testing

---
Estimated Total Time: 5 hours
