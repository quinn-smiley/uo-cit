import { useEffect, useMemo, useState } from 'react'
import { Pressable, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import QuizListScreen from './src/screens/QuizListScreen'
import QuizCreationWizardScreen from './src/screens/QuizCreationWizardScreen'
import QuizTakerScreen from './src/screens/QuizTakerScreen'
import { loadQuizzes, saveQuizzes } from './src/utils/storage.native.js'
import { colors } from './src/theme/colors'

const Stack = createNativeStackNavigator()

const SAMPLE_QUIZ = {
  id: '1',
  title: 'Sample Quiz',
  questions: [{ prompt: 'Favorite color?', choices: ['Red', 'Blue', 'Green'] }],
  thumbnail: null,
  results: [],
}

export default function App() {
  const [quizzes, setQuizzes] = useState([SAMPLE_QUIZ])
  const [loaded, setLoaded] = useState(false)

  const [activeQuizId, setActiveQuizId] = useState(null)
  const [draftQuiz, setDraftQuiz] = useState(null)
  const [editingQuizId, setEditingQuizId] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const fromStorage = await loadQuizzes()
      if (cancelled) return
      if (fromStorage && fromStorage.length > 0) setQuizzes(fromStorage)
      setLoaded(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!loaded) return
    saveQuizzes(quizzes)
  }, [loaded, quizzes])

  const activeQuiz = useMemo(
    () => quizzes.find((q) => q.id === activeQuizId) || null,
    [quizzes, activeQuizId]
  )

  const handleCreateQuiz = (newQuiz) => {
    const completeQuiz = {
      title: newQuiz.title || '',
      questions: newQuiz.questions || [],
      thumbnail: newQuiz.thumbnail || null,
      results: newQuiz.results || [],
    }

    setQuizzes((prev) => {
      const nextId = prev.length
        ? String(Math.max(...prev.map((q) => Number(q.id) || 0)) + 1)
        : '1'
      return [...prev, { ...completeQuiz, id: nextId }]
    })
  }

  const handleUpdateQuiz = (updatedQuiz) => {
    const completeQuiz = {
      title: updatedQuiz.title || '',
      questions: updatedQuiz.questions || [],
      thumbnail: updatedQuiz.thumbnail || null,
      results: updatedQuiz.results || [],
    }
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === editingQuizId ? { ...completeQuiz, id: editingQuizId } : q
      )
    )
    setEditingQuizId(null)
    setDraftQuiz(null)
  }

  const handleEditQuiz = (id) => {
    const quizToEdit = quizzes.find((q) => q.id === id)
    if (!quizToEdit) return
    setEditingQuizId(id)
    setDraftQuiz(quizToEdit)
  }

  const handleDeleteQuiz = (id) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id))
    if (activeQuizId === id) setActiveQuizId(null)
    if (editingQuizId === id) {
      setEditingQuizId(null)
      setDraftQuiz(null)
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.panel },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="List"
          options={({ navigation }) => ({
            title: 'Quizzes',
            headerRight: () => (
              <Pressable
                onPress={() => {
                  setDraftQuiz(null)
                  setEditingQuizId(null)
                  navigation.navigate('Wizard')
                }}
                style={{ paddingHorizontal: 12, paddingVertical: 6 }}
              >
                <Text style={{ color: colors.primary, fontWeight: '600' }}>
                  Create
                </Text>
              </Pressable>
            ),
          })}
        >
          {({ navigation }) => (
            <QuizListScreen
              quizzes={quizzes}
              onTakeQuiz={(id) => {
                setActiveQuizId(id)
                navigation.navigate('Taker')
              }}
              onEditQuiz={(id) => {
                handleEditQuiz(id)
                navigation.navigate('Wizard')
              }}
              onDeleteQuiz={handleDeleteQuiz}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Wizard"
          options={{ title: editingQuizId ? 'Edit Quiz' : 'Create Quiz' }}
        >
          {({ navigation }) => (
            <QuizCreationWizardScreen
              initialDraft={draftQuiz}
              isEditing={!!editingQuizId}
              onCancel={() => {
                setDraftQuiz(null)
                setEditingQuizId(null)
                navigation.goBack()
              }}
              onSubmit={(quiz) => {
                if (editingQuizId) handleUpdateQuiz(quiz)
                else handleCreateQuiz(quiz)
                navigation.navigate('List')
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Taker" options={{ title: activeQuiz?.title || 'Quiz' }}>
          {({ navigation }) => (
            <QuizTakerScreen
              quiz={activeQuiz || SAMPLE_QUIZ}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
