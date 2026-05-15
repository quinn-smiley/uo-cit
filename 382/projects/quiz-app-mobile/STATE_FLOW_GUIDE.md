# State Flow Guide - Quiz App

This document explains how state flows through your quiz application in small, digestible steps.

---

## 📍 **Step 1: App.jsx - The Central State Hub**

`App.jsx` is the **root component** that holds all the important state at the top level.

### State Variables in App.jsx:

```javascript
const [view, setView] = useState("list")
// Controls which screen is shown: 'list' | 'build' | 'wizard' | 'take'
// 🔼 LIFTED STATE: Controls navigation across multiple components

const [quizzes, setQuizzes] = useState(() => loadQuizzes() || [...])
// The master list of ALL quizzes (loaded from localStorage on startup)
// 🔼 LIFTED STATE: Shared by QuizList, QuizCreationWizard, and used to find activeQuiz

const [activeQuizId, setActiveQuizId] = useState(null)
// Which quiz is currently being taken (if any)
// 🔼 LIFTED STATE: Needed by App to determine which quiz to pass to QuizTaker

const [draftQuiz, setDraftQuiz] = useState(null)
// Temporary quiz data while user is creating/editing (not saved yet)
// 🔼 LIFTED STATE: Shared between QuizBuilder and QuizCreationWizard

const [editingQuizId, setEditingQuizId] = useState(null)
// ID of quiz being edited (if any)
// 🔼 LIFTED STATE: Needed by App to determine if we're editing vs creating
```

**Key Point:** All quiz data lives in `quizzes` array. Everything else is just navigation/UI state.

**🔼 LIFTING STATE EXPLANATION:** All of these states are "lifted" to App.jsx because they need to be shared between multiple child components or controlled by the parent. If they were kept in child components, the components couldn't communicate with each other.

---

## 📍 **Step 2: Loading State from localStorage**

When the app first loads:

1. `App.jsx` runs `loadQuizzes()` from `utils/storage.js`
2. This reads from `localStorage.getItem("quiz-app:quizzes:v1")`
3. If found, it parses the JSON and returns the array
4. If not found, it returns `null` and App uses a default sample quiz

**Flow:**
```
App mounts → loadQuizzes() → localStorage → parsed quizzes → setQuizzes()
```

---

## 📍 **Step 3: Saving State to localStorage**

Whenever `quizzes` changes:

1. `useEffect` in App.jsx watches `quizzes`
2. When it changes, it calls `saveQuizzes(quizzes)`
3. This converts the array to JSON and saves to localStorage

**Flow:**
```
quizzes changes → useEffect triggers → saveQuizzes() → JSON.stringify() → localStorage.setItem()
```

---

## 📍 **Step 4: Viewing the Quiz List**

When `view === "list"`:

1. App renders `<QuizList quizzes={quizzes} ... />`
2. `QuizList` receives the entire `quizzes` array as a prop
3. It displays each quiz in a card
4. **QuizList has its own local state:**
   - `openMenuId` - tracks which quiz's menu is open (NOT lifted - only used in QuizList)

**State Flow:**
```
App (quizzes) → QuizList (receives as prop) → displays cards
```

**🔼 LIFTING STATE EXAMPLE:** The `quizzes` array is lifted to App.jsx because:
- QuizList needs it to display quizzes
- QuizCreationWizard needs it to edit existing quizzes
- App needs it to find the active quiz for QuizTaker
- If it lived in QuizList, other components couldn't access it

**User Actions:**
- Click "Take Quiz" → calls `onTakeQuiz(q.id)` → goes to App's `handleTakeQuiz()`
- Click "Edit" → calls `onEditQuiz(q.id)` → goes to App's `handleEditQuiz()`
- Click "Delete" → calls `onDeleteQuiz(q.id)` → goes to App's `handleDeleteQuiz()`

---

## 📍 **Step 5: Creating a New Quiz - Part 1 (Build Step)**

When user clicks "Create Quiz":

1. App sets `view = "build"`
2. App renders `<QuizBuilder onSave={...} onCancel={...} />`
3. **QuizBuilder has its own local state:**
   - `title` - the quiz title (NOT lifted - only used in QuizBuilder)
   - `questions` - array of question objects (NOT lifted - only used in QuizBuilder)

**State Flow:**
```
User types → QuizBuilder local state (title, questions) → user clicks "Save Quiz"
```

When user clicks "Save Quiz":
1. QuizBuilder calls `onSave({ title, questions })`
2. This goes to App's handler: `setDraftQuiz(quizFromBuilder)`
3. App sets `view = "wizard"` (moves to next step)

**🔼 LIFTING STATE EXAMPLE:** The `draftQuiz` state is lifted to App.jsx because:
- QuizBuilder creates it and passes it up
- QuizCreationWizard needs it to continue building the quiz
- If it stayed in QuizBuilder, the Wizard couldn't access it after QuizBuilder unmounts

**Key Point:** The quiz data is NOT in `quizzes` yet - it's in `draftQuiz` (temporary).

---

## 📍 **Step 6: Creating a New Quiz - Part 2 (Wizard Steps)**

When `view === "wizard"`:

1. App renders `<QuizCreationWizard initialDraft={draftQuiz} ... />`
2. **QuizCreationWizard has its own local state:**
   - `draftQuiz` - initialized from `initialDraft` prop
   - `thumbnail` - image data URL
   - `results` - array of result objects
   - `step` - which step: 'build' | 'results' | 'thumbnail' | 'review'

**State Flow Through Wizard Steps:**

### Step A: Build (inside wizard)
- Wizard renders `<QuizBuilder initialQuiz={initialDraft} />`
- User edits questions
- On save: `setDraftQuiz(quizFromBuilder)` → `setStep('results')`

### Step B: Results
- User configures results (titles, descriptions, images, scoring)
- State lives in Wizard's `results` state
- On continue: `setStep('thumbnail')`

### Step C: Thumbnail
- User uploads thumbnail image
- State lives in Wizard's `thumbnail` state
- On continue: `setStep('review')`

### Step D: Review
- Shows all data from `draftQuiz`, `thumbnail`, and `results`
- On "Publish": calls `onSubmit(finalQuiz)`

---

## 📍 **Step 7: Saving the Final Quiz**

When user clicks "Publish Quiz" in Review step:

1. Wizard calls `onSubmit(finalQuiz)` 
2. This goes to App's `handleCreateQuiz(finalQuiz)`
3. App does:
   ```javascript
   setQuizzes(prev => [...prev, { ...finalQuiz, id: nextId }])
   ```
4. This adds the new quiz to the `quizzes` array
5. `useEffect` detects `quizzes` changed → saves to localStorage
6. App sets `view = "list"` (goes back to list)

**Complete Flow:**
```
Wizard → onSubmit() → handleCreateQuiz() → setQuizzes() → useEffect → localStorage
```

---

## 📍 **Step 8: Editing an Existing Quiz**

When user clicks "Edit" on a quiz:

1. QuizList calls `onEditQuiz(q.id)`
2. App's `handleEditQuiz(id)` runs:
   ```javascript
   const quizToEdit = quizzes.find(q => q.id === id)
   setEditingQuizId(id)
   setDraftQuiz(quizToEdit)  // Copy quiz data to draft
   setView('wizard')
   ```
3. Wizard receives `initialDraft={draftQuiz}` and `isEditing={true}`
4. Wizard initializes its state from `initialDraft`
5. User edits and clicks "Save Changes"
6. Wizard calls `onSubmit(updatedQuiz)`
7. App's `handleUpdateQuiz(updatedQuiz)` runs:
   ```javascript
   setQuizzes(prev => prev.map(q => 
     q.id === editingQuizId ? { ...updatedQuiz, id: editingQuizId } : q
   ))
   ```
8. Updates the quiz in the array → saves to localStorage

**Key Point:** Editing uses the same wizard, but updates existing quiz instead of creating new one.

---

## 📍 **Step 9: Taking a Quiz**

When user clicks "Take Quiz":

1. QuizList calls `onTakeQuiz(q.id)`
2. App's `handleTakeQuiz(id)` runs:
   ```javascript
   setActiveQuizId(id)
   setView("take")
   ```
3. App finds the quiz: `const activeQuiz = quizzes.find(q => q.id === activeQuizId)`
4. App renders `<QuizTaker quiz={activeQuiz} onBack={...} />`
5. **QuizTaker has its own local state:**
   - `answers` - array of selected choice indices: `[0, 1, null, 2]` (NOT lifted - only used in QuizTaker)
   - `submitted` - boolean, whether quiz was submitted (NOT lifted - only used in QuizTaker)

**State Flow:**
```
User selects answers → QuizTaker local state (answers) → user clicks "Submit"
```

**🔼 LIFTING STATE EXAMPLE:** The `activeQuizId` is lifted to App.jsx because:
- QuizList needs to set it when user clicks "Take Quiz"
- App needs it to find which quiz to pass to QuizTaker
- If it lived in QuizTaker, QuizList couldn't set it

When user clicks "Submit":
1. `setSubmitted(true)`
2. QuizTaker calculates result using `calculateResult()`
3. Displays the matched result
4. User clicks "Done" → calls `onBack()` → App sets `view = "list"`

**Key Point:** QuizTaker doesn't modify the quiz data - it only reads it and calculates results.

---

## 📍 **Step 10: Deleting a Quiz**

When user clicks "Delete":

1. QuizList calls `onDeleteQuiz(q.id)`
2. App's `handleDeleteQuiz(id)` runs:
   ```javascript
   setQuizzes(prev => prev.filter(q => q.id !== id))
   ```
3. Removes quiz from array
4. `useEffect` detects change → saves to localStorage
5. If deleted quiz was active/editing, resets those states

**Flow:**
```
Delete click → handleDeleteQuiz() → setQuizzes() → useEffect → localStorage
```

---

## 🔄 **State Flow Summary**

### **🔼 Lifted State (In App.jsx - Shared Between Components):**
- **`quizzes`** - Shared by QuizList, QuizCreationWizard, and used to find activeQuiz
- **`view`** - Controls which component is shown (navigation)
- **`draftQuiz`** - Shared between QuizBuilder and QuizCreationWizard
- **`activeQuizId`** - Needed by App to determine which quiz to pass to QuizTaker
- **`editingQuizId`** - Needed by App to determine if editing vs creating

### **Downward Flow (Parent → Child):**
```
App (quizzes) → QuizList (prop)                    [LIFTED STATE]
App (draftQuiz) → QuizCreationWizard (initialDraft) [LIFTED STATE]
App (activeQuiz) → QuizTaker (quiz prop)            [LIFTED STATE]
```

### **Upward Flow (Child → Parent - Lifting State Up):**
```
QuizList → onTakeQuiz(id) → App.handleTakeQuiz() → setActiveQuizId() [LIFTS activeQuizId]
QuizBuilder → onSave(quiz) → App.setDraftQuiz() [LIFTS draftQuiz]
QuizCreationWizard → onSubmit(quiz) → App.handleCreateQuiz() → setQuizzes() [LIFTS quizzes]
QuizTaker → onBack() → App.setView("list") [LIFTS view]
```

### **Local State (Component-Specific - NOT Lifted):**
- **QuizList:** `openMenuId` (which menu is open) - only used in QuizList
- **QuizBuilder:** `title`, `questions` (form inputs) - only used in QuizBuilder
- **QuizCreationWizard:** `thumbnail`, `results`, `step` (wizard state) - only used in Wizard
- **QuizTaker:** `answers`, `submitted` (quiz-taking state) - only used in QuizTaker

### **Persistent State:**
- **localStorage:** `quizzes` array (saved automatically when `quizzes` changes)

---

## 🎯 **Key Concepts**

1. **Single Source of Truth:** The `quizzes` array in App.jsx is the master list
2. **Props Down, Events Up:** Data flows down as props, changes flow up as callbacks
3. **🔼 Lifting State:** State is moved from child to parent when:
   - Multiple components need to share it
   - Parent needs to control/manage it
   - State needs to persist when child unmounts
4. **Local State for UI:** Components manage their own UI state (menus, form inputs) that don't need to be shared
5. **Draft Pattern:** `draftQuiz` holds temporary data during creation/editing (lifted to App so it persists between wizard steps)
6. **Automatic Persistence:** `useEffect` watches `quizzes` and saves to localStorage

## 🔼 **Lifting State - Quick Reference**

**When to Lift State:**
- ✅ Multiple components need the same data → Lift to common parent
- ✅ Parent needs to control child's state → Lift to parent
- ✅ State must persist when component unmounts → Lift to parent
- ❌ State only used in one component → Keep it local
- ❌ State is temporary UI state (like menu open/closed) → Keep it local

**Examples in This App:**
- `quizzes` - Lifted because QuizList, QuizCreationWizard, and App all need it
- `draftQuiz` - Lifted because QuizBuilder creates it, but QuizCreationWizard needs it
- `activeQuizId` - Lifted because QuizList sets it, but App needs it to find the quiz
- `view` - Lifted because it controls which component App renders
- `answers` in QuizTaker - NOT lifted because only QuizTaker needs it
- `openMenuId` in QuizList - NOT lifted because only QuizList needs it

---

## 📊 **Visual State Flow Diagram**

```
┌─────────────────────────────────────────┐
│           App.jsx (Root)                 │
│  ┌───────────────────────────────────┐  │
│  │ quizzes (master list)             │  │
│  │ view (navigation)                 │  │
│  │ draftQuiz (temporary)             │  │
│  │ activeQuizId (current quiz)       │  │
│  │ editingQuizId (editing state)     │  │
│  └───────────────────────────────────┘  │
│           │         │         │          │
│           ▼         ▼         ▼          │
│      QuizList   Wizard   QuizTaker      │
│      (reads)   (writes)   (reads)       │
│           │         │         │          │
│           └─────────┴─────────┘         │
│                  │                      │
│                  ▼                      │
│            localStorage                 │
│         (automatic save)                │
└─────────────────────────────────────────┘
```

---

This guide should help you understand how state moves through your application! Each component has a specific role, and state flows in predictable patterns.

