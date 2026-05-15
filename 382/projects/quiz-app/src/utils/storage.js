import { STORAGE_KEY } from '../constants/index.js';

/**
 * Normalizes quiz results to ensure backward compatibility
 * Converts old formats (conditions, conditionSets) to new format (scoring)
 */
function normalizeQuizResults(results) {
  return (Array.isArray(results) ? results : []).map(result => {
    // If it already has scoring, it's in the new format
    if (result.scoring !== undefined) return result
    
    // If it has conditionSets, keep it (old format but still supported)
    if (result.conditionSets) return result
    
    // Migrate very old format: conditions -> conditionSets with single set
    if (result.conditions && result.conditions.length > 0) {
      return { ...result, conditionSets: [result.conditions], conditions: undefined }
    }
    
    // Default: add empty scoring object for new format
    return { ...result, scoring: {} }
  })
}

/**
 * Normalizes a quiz object to ensure all required fields are present
 */
function normalizeQuiz(quiz) {
  const normalizedResults = normalizeQuizResults(quiz.results)
  
  return {
    id: quiz.id || String(Date.now()),
    title: quiz.title || '',
    questions: Array.isArray(quiz.questions) ? quiz.questions : [],
    thumbnail: quiz.thumbnail || null,
    results: normalizedResults
  }
}

/**
 * Loads quizzes from localStorage
 * @returns {Array|null} Array of quizzes or null if loading fails
 */
export function loadQuizzes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      console.log('[Storage] No quizzes found in localStorage')
      return null
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      console.warn('[Storage] Invalid quiz data format in localStorage')
      return null
    }
    
    // Verify and normalize loaded quizzes to ensure all fields are present
    const normalized = parsed.map(normalizeQuiz)
    
    console.log('[Storage] Loaded quizzes from localStorage:', {
      count: normalized.length,
      totalSize: `${(raw.length / 1024).toFixed(2)} KB`,
      quizzesWithThumbnails: normalized.filter(q => q.thumbnail).length,
      quizzesWithResults: normalized.filter(q => q.results && q.results.length > 0).length
    })
    
    return normalized
  } catch (e) {
    console.error('[Storage] Failed to parse quizzes from localStorage', e)
    return null
  }
}

/**
 * Saves quizzes to localStorage
 * @param {Array} quizzes - Array of quiz objects to save
 */
export function saveQuizzes(quizzes) {
  try {
    // Verify all quiz data is present before saving (preserve existing formats for backward compatibility)
    const quizzesToSave = quizzes.map(quiz => {
      // Keep results as-is (supports scoring, conditionSets, and old conditions formats)
      const normalizedResults = (Array.isArray(quiz.results) ? quiz.results : []).map(result => {
        // Ensure at least one format exists
        if (!result.scoring && !result.conditionSets && !result.conditions) {
          return { ...result, scoring: {} }
        }
        return result
      })
      
      return {
        id: quiz.id,
        title: quiz.title || '',
        questions: quiz.questions || [],
        thumbnail: quiz.thumbnail || null,
        results: normalizedResults
      }
    })
    
    const serialized = JSON.stringify(quizzesToSave)
    localStorage.setItem(STORAGE_KEY, serialized)
    console.log('[Storage] Successfully saved quizzes to localStorage', {
      count: quizzesToSave.length,
      totalSize: `${(serialized.length / 1024).toFixed(2)} KB`
    })
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      console.error('[Storage] localStorage quota exceeded. Thumbnail images may be too large. Consider using smaller images.')
      // Try saving without thumbnails as fallback
      try {
        const quizzesWithoutThumbnails = quizzes.map(quiz => ({
          ...quiz,
          thumbnail: null
        }))
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzesWithoutThumbnails))
        console.warn('[Storage] Saved quizzes without thumbnails due to storage limit')
      } catch (fallbackError) {
        console.error('[Storage] Failed to save quizzes even without thumbnails:', fallbackError)
      }
    } else {
      console.error('[Storage] Failed to save quizzes to localStorage:', e)
    }
  }
}

