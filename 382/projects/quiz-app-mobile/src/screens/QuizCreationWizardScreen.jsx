/**
 * React Native version of Quiz Creation Wizard (build → results → thumbnail → review).
 * Requires: npx expo install expo-image-picker
 * Props: onCancel, onSubmit(quiz), initialDraft, isEditing
 */
import { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Alert,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import QuizBuilderScreen from './QuizBuilderScreen'
import { colors } from '../theme/colors'
import { useResponsive } from '../theme/layout'

const intensityToScore = { low: 2, medium: 5, high: 8 }

function scoreToIntensity(score) {
  if (score >= 7) return 'high'
  if (score >= 4) return 'medium'
  if (score >= 1) return 'low'
  return null
}

function normalizeResult(result) {
  if (result.scoring !== undefined) return result
  if (result.conditionSets) return { ...result, scoring: {} }
  if (result.conditions) return { ...result, scoring: {} }
  return { ...result, scoring: {} }
}

export default function QuizCreationWizardScreen({
  onCancel,
  onSubmit,
  initialDraft = null,
  isEditing = false,
}) {
  const [draftQuiz, setDraftQuiz] = useState(() => initialDraft ?? null)
  const [thumbnail, setThumbnail] = useState(() => initialDraft?.thumbnail ?? null)
  const [results, setResults] = useState(() => initialDraft?.results ?? [])
  const [step, setStep] = useState('build')

  const handleBuilderSave = (quizFromBuilder) => {
    setDraftQuiz(quizFromBuilder)
    setStep('results')
  }

  const goToThumbnail = () => {
    if (draftQuiz) setStep('thumbnail')
  }

  const goToReview = () => {
    if (draftQuiz) setStep('review')
  }

  const handlePost = () => {
    if (!draftQuiz) return
    onSubmit({
      title: draftQuiz.title || '',
      questions: draftQuiz.questions || [],
      thumbnail: thumbnail || null,
      results: results || [],
    })
  }

  const label =
    step === 'build'
      ? isEditing ? 'Edit Quiz' : 'Build Quiz'
      : step === 'results'
        ? 'Configure Results'
        : step === 'thumbnail'
          ? 'Add Thumbnail (Optional)'
          : isEditing
            ? 'Review & Save Changes'
            : 'Review & Publish'

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{label}</Text>
        <Text style={styles.headerStep}>Step: {step}</Text>
      </View>

      {step === 'build' && (
        <View style={styles.stepContent}>
          <Text style={styles.hint}>
            {isEditing
              ? 'Edit your quiz questions and choices.'
              : 'Build your quiz. Next, configure results based on answers.'}
          </Text>
          <QuizBuilderScreen
            onCancel={onCancel}
            onSave={handleBuilderSave}
            initialQuiz={initialDraft}
          />
        </View>
      )}

      {step === 'results' && draftQuiz && (
        <ResultsStep
          quiz={draftQuiz}
          results={results}
          onChange={setResults}
          onBack={() => setStep('build')}
          onNext={goToThumbnail}
          onCancel={onCancel}
        />
      )}

      {step === 'thumbnail' && (
        <ThumbnailStep
          thumbnail={thumbnail}
          onChange={setThumbnail}
          onBack={() => setStep('results')}
          onNext={goToReview}
          onCancel={onCancel}
          isEditing={isEditing}
        />
      )}

      {step === 'review' && draftQuiz && (
        <ReviewStep
          quiz={{ ...draftQuiz, thumbnail: thumbnail || null, results: results || [] }}
          onBack={() => setStep('thumbnail')}
          onPost={handlePost}
          onCancel={onCancel}
          isEditing={isEditing}
        />
      )}
    </View>
  )
}

function ThumbnailStep({ thumbnail, onChange, onBack, onNext, onCancel }) {
  const [error, setError] = useState(null)
  const { width, isSmall } = useResponsive()
  const previewWidth = Math.min(isSmall ? width - 32 : 420, 520)
  const previewHeight = Math.round((previewWidth * 9) / 16)

  const pickImage = async () => {
    setError(null)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      setError('Permission to access photos is required.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      base64: true,
      quality: 0.8,
    })
    if (result.canceled) return
    const asset = result.assets[0]
    const dataUri = asset.base64
      ? `data:image/jpeg;base64,${asset.base64}`
      : asset.uri
    onChange(dataUri)
  }

  return (
    <ScrollView style={styles.stepContent} contentContainerStyle={styles.stepScroll}>
      <Text style={styles.paragraph}>Upload an optional thumbnail for the list page.</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Pressable style={styles.primaryButton} onPress={pickImage}>
        <Text style={styles.primaryButtonText}>Select Image</Text>
      </Pressable>
      {thumbnail ? (
        <View style={styles.previewBox}>
          <Image
            source={{ uri: thumbnail }}
            style={[styles.previewImage, { width: previewWidth, height: previewHeight }]}
            resizeMode="cover"
          />
          <Pressable style={styles.secondaryButton} onPress={() => onChange(null)}>
            <Text style={styles.secondaryButtonText}>Remove</Text>
          </Pressable>
        </View>
      ) : null}
      <View style={styles.rowButtons}>
        <Pressable style={styles.secondaryButton} onPress={onBack}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={onNext}>
          <Text style={styles.primaryButtonText}>Continue to Review</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onCancel}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

function ResultsStep({ quiz, results, onChange, onBack, onNext, onCancel }) {
  const idCounterRef = useRef(0)
  const normalizedResults = results.map(normalizeResult)
  const { width, isSmall } = useResponsive()
  const imageWidth = Math.min(isSmall ? width - 32 : 360, 460)
  const imageHeight = Math.round((imageWidth * 3) / 4)

  const addResult = () => {
    idCounterRef.current += 1
    onChange([
      ...normalizedResults,
      {
        id: `result-${idCounterRef.current}-${normalizedResults.length}`,
        title: '',
        description: '',
        scoring: {},
      },
    ])
  }

  const removeResult = (id) => onChange(normalizedResults.filter((r) => r.id !== id))

  const updateResult = (resultId, field, value) => {
    onChange(
      normalizedResults.map((r) => (r.id === resultId ? { ...r, [field]: value } : r))
    )
  }

  const pickResultImage = async (resultId) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to photos to add an image.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 0.8,
    })
    if (result.canceled) return
    const asset = result.assets[0]
    const dataUri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri
    updateResult(resultId, 'image', dataUri)
  }

  const updateContribution = (resultId, qIdx, cIdx, contributes, intensity) => {
    onChange(
      normalizedResults.map((r) => {
        if (r.id !== resultId) return r
        const scoring = { ...(r.scoring || {}) }
        const key = `q${qIdx}c${cIdx}`
        if (contributes && intensity) scoring[key] = intensityToScore[intensity]
        else delete scoring[key]
        return { ...r, scoring }
      })
    )
  }

  const getContribution = (result, qIdx, cIdx) => {
    const score = result.scoring?.[`q${qIdx}c${cIdx}`] || 0
    const contributes = score > 0
    const intensity = scoreToIntensity(score) || 'low'
    return { contributes, intensity }
  }

  const intensityOptions = ['low', 'medium', 'high']

  return (
    <ScrollView style={styles.stepContent} contentContainerStyle={styles.stepScroll}>
      <Text style={styles.sectionTitle}>Configure Results</Text>
      <Text style={styles.hint}>
        Check which answer choices contribute to each result and set their intensity.
      </Text>
      {normalizedResults.length === 0 && (
        <View style={styles.emptyHint}>
          <Text style={styles.emptyHintText}>No results configured. Add at least one.</Text>
        </View>
      )}

      {normalizedResults.map((result, rIdx) => (
        <View key={result.id} style={styles.resultCard}>
          <Text style={styles.resultLegend}>Result {rIdx + 1}</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Result Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Type A Personality"
              placeholderTextColor="#888"
              value={result.title}
              onChangeText={(v) => updateResult(result.id, 'title', v)}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what this result means..."
              placeholderTextColor="#888"
              value={result.description}
              onChangeText={(v) => updateResult(result.id, 'description', v)}
              multiline
              numberOfLines={3}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Result Image (Optional)</Text>
            <Pressable style={styles.primaryButton} onPress={() => pickResultImage(result.id)}>
              <Text style={styles.primaryButtonText}>Select Image</Text>
            </Pressable>
            {result.image ? (
              <View style={styles.previewBox}>
                <Image
                  source={{ uri: result.image }}
                  style={[styles.resultPreviewImage, { width: imageWidth, height: imageHeight }]}
                  resizeMode="cover"
                />
                <Pressable style={styles.smallButton} onPress={() => updateResult(result.id, 'image', null)}>
                  <Text style={styles.smallButtonText}>Remove Image</Text>
                </Pressable>
              </View>
            ) : null}
          </View>

          <Text style={styles.subSectionTitle}>Answer contributions</Text>
          {quiz.questions.map((question, qIdx) => (
            <View key={qIdx} style={styles.questionBlock}>
              <Text style={styles.questionPrompt}>Q{qIdx + 1}: {question.prompt}</Text>
              {question.choices.map((choice, cIdx) => {
                const { contributes, intensity } = getContribution(result, qIdx, cIdx)
                return (
                  <View key={cIdx} style={styles.choiceContribRow}>
                    <Pressable
                      style={styles.checkboxRow}
                      onPress={() =>
                        updateContribution(
                          result.id,
                          qIdx,
                          cIdx,
                          !contributes,
                          contributes ? intensity : 'low'
                        )
                      }
                    >
                      <View style={[styles.checkbox, contributes && styles.checkboxChecked]}>
                        {contributes && <View style={styles.checkboxInner} />}
                      </View>
                      <Text style={styles.choiceLabel}>{choice}</Text>
                    </Pressable>
                    {contributes && (
                      <View style={styles.intensityRow}>
                        {intensityOptions.map((opt) => (
                          <Pressable
                            key={opt}
                            style={[
                              styles.intensityChip,
                              intensity === opt && styles.intensityChipSelected,
                            ]}
                            onPress={() => updateContribution(result.id, qIdx, cIdx, true, opt)}
                          >
                            <Text
                              style={[
                                styles.intensityChipText,
                                intensity === opt && styles.intensityChipTextSelected,
                              ]}
                            >
                              {opt}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          ))}
          <Pressable style={styles.removeResultBtn} onPress={() => removeResult(result.id)}>
            <Text style={styles.dangerText}>Remove Result</Text>
          </Pressable>
        </View>
      ))}

      <Pressable style={styles.primaryButton} onPress={addResult}>
        <Text style={styles.primaryButtonText}>+ Add Result</Text>
      </Pressable>

      <View style={styles.rowButtons}>
        <Pressable style={styles.secondaryButton} onPress={onBack}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={onNext}>
          <Text style={styles.primaryButtonText}>Continue to Thumbnail</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onCancel}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

function ReviewStep({ quiz, onBack, onPost, onCancel, isEditing }) {
  const { width, isSmall } = useResponsive()
  const thumbWidth = Math.min(isSmall ? width - 32 : 520, 680)
  const thumbHeight = Math.round((thumbWidth * 9) / 16)

  return (
    <ScrollView style={styles.stepContent} contentContainerStyle={styles.stepScroll}>
      <Text style={styles.sectionTitle}>Final Review</Text>
      {quiz.thumbnail ? (
        <Image
          source={{ uri: quiz.thumbnail }}
          style={[styles.reviewThumb, { width: thumbWidth, height: thumbHeight }]}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.muted}>No thumbnail added.</Text>
      )}
      <Text style={styles.reviewLine}>
        <Text style={styles.bold}>Title:</Text>{' '}
        <Text style={styles.text}>{quiz.title || '(untitled)'}</Text>
      </Text>
      <Text style={styles.reviewLine}>
        <Text style={styles.bold}>Questions:</Text>{' '}
        <Text style={styles.text}>{quiz?.questions?.length ?? 0}</Text>
      </Text>
      <Text style={styles.reviewLine}>
        <Text style={styles.bold}>Results:</Text>{' '}
        <Text style={styles.text}>{quiz?.results?.length ?? 0}</Text>
      </Text>
      {(quiz.questions || []).map((q, idx) => (
        <View key={idx} style={styles.reviewQuestion}>
          <Text>
            <Text style={styles.bold}>Q{idx + 1}:</Text>{' '}
            <Text style={styles.text}>{q.prompt || '(no prompt)'}</Text>
          </Text>
          <Text style={styles.choiceList}>{(q.choices || []).join(', ')}</Text>
        </View>
      ))}
      {quiz.results?.length > 0 && (
        <View style={styles.reviewResults}>
          <Text style={styles.subSectionTitle}>Results</Text>
          {quiz.results.map((r, idx) => (
            <View key={r.id || idx} style={styles.reviewResultItem}>
              <Text style={styles.bold}>{r.title || `Result ${idx + 1}`}</Text>
              {r.description ? <Text style={styles.muted}>{r.description}</Text> : null}
              {r.image ? (
                <Image source={{ uri: r.image }} style={styles.reviewResultImage} resizeMode="cover" />
              ) : null}
            </View>
          ))}
        </View>
      )}
      <View style={styles.rowButtons}>
        <Pressable style={styles.secondaryButton} onPress={onBack}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={onPost}>
          <Text style={styles.primaryButtonText}>{isEditing ? 'Save Changes' : 'Publish Quiz'}</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onCancel}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.panel },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  headerStep: { fontSize: 14, color: colors.muted, marginTop: 4 },
  stepContent: { flex: 1 },
  stepScroll: { padding: 16, paddingBottom: 32 },
  hint: { fontSize: 14, color: colors.muted, marginBottom: 16 },
  paragraph: { fontSize: 16, color: colors.text, marginBottom: 12 },
  errorText: { color: '#b00020', marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  subSectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginTop: 16, marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: colors.panel,
    color: colors.text,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  emptyHint: { padding: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 8, marginBottom: 16 },
  emptyHintText: { fontSize: 14, color: colors.muted },
  resultCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  resultLegend: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  questionBlock: { marginTop: 12, padding: 12, backgroundColor: colors.elev, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  questionPrompt: { fontWeight: 'bold', fontSize: 15, color: colors.text, marginBottom: 10 },
  choiceContribRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 10, gap: 8 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { borderColor: colors.primary, backgroundColor: colors.primary },
  checkboxInner: { width: 10, height: 10, borderRadius: 2, backgroundColor: '#fff' },
  choiceLabel: { fontSize: 15, color: colors.text, flex: 1 },
  intensityRow: { flexDirection: 'row', gap: 8 },
  intensityChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.elev },
  intensityChipSelected: { borderColor: colors.primary, backgroundColor: colors.primaryBg },
  intensityChipText: { fontSize: 14, color: colors.text },
  intensityChipTextSelected: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  removeResultBtn: { marginTop: 12, alignSelf: 'flex-end' },
  dangerText: { fontSize: 14, color: colors.danger },
  primaryButton: { backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, marginBottom: 12 },
  primaryButtonText: { color: colors.bg, fontSize: 16, fontWeight: '600' },
  secondaryButton: { backgroundColor: colors.panel, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginRight: 8, marginBottom: 8 },
  secondaryButtonText: { fontSize: 16, color: colors.text },
  smallButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.elev, alignSelf: 'flex-start', marginTop: 8 },
  smallButtonText: { fontSize: 14, color: colors.text },
  rowButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  previewBox: { marginTop: 12 },
  previewImage: { borderRadius: 8, backgroundColor: colors.elev, borderWidth: 1, borderColor: colors.border },
  resultPreviewImage: { borderRadius: 8, backgroundColor: colors.elev, borderWidth: 1, borderColor: colors.border },
  reviewThumb: { borderRadius: 8, marginBottom: 12, backgroundColor: colors.elev, borderWidth: 1, borderColor: colors.border },
  reviewLine: { marginBottom: 8, fontSize: 16, color: colors.text },
  text: { color: colors.text },
  bold: { fontWeight: 'bold', color: colors.text },
  muted: { fontSize: 14, color: colors.muted, marginBottom: 12 },
  reviewQuestion: { marginBottom: 12, padding: 8, backgroundColor: colors.elev, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  choiceList: { fontSize: 14, color: colors.muted, marginTop: 4 },
  reviewResults: { marginTop: 16 },
  reviewResultItem: { marginBottom: 16, padding: 12, backgroundColor: colors.panel, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  reviewResultImage: { width: 200, height: 150, borderRadius: 8, marginTop: 8 },
})
