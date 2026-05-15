import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORAGE_KEY } from '../constants/index.js'

function normalizeQuizResults(results) {
  return (Array.isArray(results) ? results : []).map((result) => {
    if (result.scoring !== undefined) return result
    if (result.conditionSets) return result
    if (result.conditions && result.conditions.length > 0) {
      return { ...result, conditionSets: [result.conditions], conditions: undefined }
    }
    return { ...result, scoring: {} }
  })
}

function normalizeQuiz(quiz) {
  return {
    id: quiz.id || String(Date.now()),
    title: quiz.title || '',
    questions: Array.isArray(quiz.questions) ? quiz.questions : [],
    thumbnail: quiz.thumbnail || null,
    results: normalizeQuizResults(quiz.results),
  }
}

export async function loadQuizzes() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.map(normalizeQuiz)
  } catch {
    return null
  }
}

export async function saveQuizzes(quizzes) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes))
  } catch {
    // ignore
  }
}

