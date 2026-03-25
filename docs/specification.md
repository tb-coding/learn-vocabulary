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

### NEW: Seed Data Generation (v1.1.0)

#### Feature Description
Automatically generate 100 common daily life vocabulary words from online dictionaries to provide immediate value for new users.

#### Data Structure
```typescript
interface SeedVocabulary {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb';
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  source: string; // API source
}

interface SeedDataConfig {
  totalWords: 100;
  categories: {
    food: number;      // 20 words
    travel: number;    // 20 words
    work: number;      // 20 words
    emotions: number;  // 15 words
    daily: number;     // 15 words
    technology: number; // 10 words
  };
  difficultyDistribution: {
    easy: 40;    // 40%
    medium: 45;  // 45%
    hard: 15;    // 15%
  };
}
```

#### Word Categories & Examples

**Food (20 words)**
- Easy: apple, bread, water, coffee, rice
- Medium: ingredient, cuisine, beverage, dessert, recipe
- Hard: gastronomy, appetizer, confectionery, condiment, palate

**Travel (20 words)**
- Easy: trip, hotel, map, ticket, airport
- Medium: itinerary, destination, accommodation, excursion, reservation
- Hard: itinerary, embarkation, disembarkation, concierge, sightseeing

**Work (20 words)**
- Easy: job, office, meeting, email, report
- Medium: deadline, colleague, presentation, schedule, conference
- Hard: negotiation, collaboration, administration, productivity, delegation

**Emotions (15 words)**
- Easy: happy, sad, angry, tired, excited
- Medium: anxious, grateful, frustrated, confident, disappointed
- Hard: melancholy, euphoria, apprehensive, overwhelmed, contentment

**Daily Life (15 words)**
- Easy: morning, evening, routine, chore, schedule
- Medium: appointment, errand, maintenance, organization, preparation
- Hard: punctuality, responsibility, discipline, convenience, efficiency

**Technology (10 words)**
- Easy: phone, computer, internet, website, password
- Medium: software, hardware, network, database, interface
- Hard: algorithm, encryption, bandwidth, compatibility, authentication

#### Implementation Plan

##### Phase 1: Data Fetching (30 min)
- Research Free Dictionary API (https://dictionaryapi.dev/)
- Create seedDataGenerator.ts service
- Implement API fetching with error handling
- Add fallback word list for offline scenarios

##### Phase 2: Data Processing (30 min)
- Map API response to SeedVocabulary interface
- Assign difficulty levels based on word frequency
- Categorize words by tags
- Generate unique IDs

##### Phase 3: Integration (45 min)
- Create SeedDataManager composable
- Auto-populate on first app launch
- Add "Reset to Seed Data" button in settings
- Store seed data in public/seed-data.json

##### Phase 4: Testing (15 min)
- Verify all 100 words load correctly
- Test categorization accuracy
- Check difficulty distribution
- Validate API fallback mechanism

#### API Integration

**Primary API**: Free Dictionary API
```typescript
// API Endpoint
https://api.dictionaryapi.dev/api/v2/entries/en/{word}

// Response Structure
interface DictionaryAPIResponse {
  word: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}
```

**Fallback Strategy**:
- Maintain static JSON file with 100 pre-defined words
- Use static data if API is unavailable
- Allow manual import/export of seed data

#### UI/UX Changes

1. **Onboarding Screen**
   - Show loading indicator while fetching seed data
   - Display success message with word count
   - Option to skip seed data

2. **Vocabulary List**
   - Add filter by source (seed/user)
   - Tag-based filtering

3. **Settings Panel**
   - "Load Seed Data" button
   - "Reset to Seed Data" option
   - Export seed data as JSON

#### Testing Checklist
- [ ] All 100 words load successfully
- [ ] Difficulty distribution matches spec (40/45/15)
- [ ] Category distribution is correct
- [ ] Words have complete data (word, definition, example, tags)
- [ ] API error fallback works
- [ ] localStorage persistence works
- [ ] Quiz mode works with seed data
- [ ] Reset functionality works

## Technical Architecture

### Project Structure
```
src/
├── components/
│   ├── VocabList.vue       # Vocabulary list view
│   ├── VocabCard.vue       # Single word card
│   ├── QuizMode.vue        # Quiz interface
│   ├── AddVocabDialog.vue  # Add word dialog
│   ├── StatsPanel.vue      # Statistics display
│   └── SeedDataLoader.vue  # NEW: Seed data loading UI
├── composables/
│   ├── useVocab.js         # Vocabulary management
│   ├── useQuiz.js          # Quiz logic
│   ├── useStorage.js       # localStorage wrapper
│   └── useSeedData.js      # NEW: Seed data management
├── services/
│   └── seedDataGenerator.ts # NEW: API integration
├── data/
│   └── seed-words.json     # NEW: Fallback word list
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
- Filter by source (seed/user)

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
- Seed data statistics

#### SeedDataLoader.vue (NEW)
- Loading indicator
- Progress bar (0-100 words)
- Success/error states
- Skip option

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
  source: 'seed' | 'user'; // NEW
}

interface QuizResult {
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
  completedAt: Date;
}

interface SeedDataState {
  isLoading: boolean;
  isLoaded: boolean;
  wordCount: number;
  error: string | null;
}
```

### UI/UX Specifications
- Theme: Light/Dark mode toggle
- Primary color: Indigo (#6366f1)
- Card-based layout
- Smooth transitions (300ms)
- Toast notifications for feedback
- Loading skeletons for async operations

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

### Phase 4: NEW - Seed Data Feature (2 hours)
- Implement seed data generator
- Integrate Dictionary API
- Build loading UI
- Add reset functionality

### Phase 5: Polish (1 hour)
- Statistics dashboard
- Animations
- Error handling
- Testing

---

## Bug Fixes

### Bug #1: 拼字遊戲頁面組件重疊問題 (v1.1.1)
**Date:** 2026-03-25
**Component:** QuizMode.vue
**Severity:** Medium
**Status:** Pending

**Description:**
在拼字遊戲頁面中，問題描述文字與選項按鈕出現組件重疊問題。經 Code Review 發現問題位於第 34-37 行的三元表達式中，模板字符串使用了 `\n` 作為換行符，導致在 Vue 模板的 `{{ }}` 表達式中渲染異常。

**Root Cause:**
```vue
{{ currentQuestion.type === 'word_to_definition'
  ? `What is the definition of "${currentQuestion.question}"?`
  : `Which word matches this definition?\n"${currentQuestion.question}"`
}}
```
模板字符串中的 `\n` 在 Vue 插值表達式中不會被正確解析為換行，導致 DOM 結構異常。

**Fix Solution:**
使用 Vue 的 `<br>` 標籤或 `v-html` 來處理多行文字，或將問題描述拆分為多個 DOM 元素。

**Implementation:**
- 使用 `<v-col>` 或 `<div>` 結構來正確佈局問題描述
- 或使用 CSS `white-space: pre-line` 樣式

**Estimated Time:** 15 min

---
Estimated Total Time: 7 hours (including seed data feature)
Version: 1.1.1
Last Updated: 2026-03-25
