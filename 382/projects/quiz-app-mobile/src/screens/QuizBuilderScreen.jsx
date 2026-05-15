/**
 * React Native version of Quiz Builder (title + questions + choices).
 * Props: onSave(quiz), onCancel, initialQuiz
 */
import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native'
import { colors } from '../theme/colors'

const MIN_CHOICES = 2
const MAX_CHOICES = 5

const emptyQuestion = () => ({ prompt: '', choices: ['', '', ''] })

export default function QuizBuilderScreen({ onSave, onCancel, initialQuiz = null }) {
  const [title, setTitle] = useState(() => initialQuiz?.title || '')
  const [questions, setQuestions] = useState(() =>
    initialQuiz?.questions?.length > 0
      ? initialQuiz.questions.map((q) => ({
          prompt: q.prompt || '',
          choices: q.choices?.length > 0 ? q.choices : ['', '', ''],
        }))
      : [emptyQuestion()]
  )

  const updateQuestionField = (idx, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    )
  }

  const updateChoice = (qIdx, cIdx, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q
        const choices = q.choices.slice()
        choices[cIdx] = value
        return { ...q, choices }
      })
    )
  }

  const addChoice = (qIdx) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q
        if (q.choices.length >= MAX_CHOICES) return q
        return { ...q, choices: [...q.choices, ''] }
      })
    )
  }

  const removeChoice = (qIdx, cIdx) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q
        if (q.choices.length <= MIN_CHOICES) return q
        return { ...q, choices: q.choices.filter((_, idx) => idx !== cIdx) }
      })
    )
  }

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()])

  const removeQuestion = (idx) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx))
  }

  const isValid = () => {
    if (!title.trim()) return false
    if (questions.length === 0) return false
    return questions.every(
      (q) =>
        q.prompt.trim() &&
        q.choices.length >= MIN_CHOICES &&
        q.choices.length <= MAX_CHOICES &&
        q.choices.every((c) => c.trim())
    )
  }

  const handleSubmit = () => {
    if (!isValid()) return
    onSave({
      title: title.trim(),
      questions: questions.map((q) => ({
        prompt: q.prompt.trim(),
        choices: q.choices.map((c) => c.trim()),
      })),
    })
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>
        {initialQuiz ? 'Edit Quiz' : 'Create a Quiz'}
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Icebreaker Questions"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {questions.map((q, qIdx) => (
        <View key={qIdx} style={styles.questionCard}>
          <Text style={styles.questionLegend}>Question {qIdx + 1}</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Prompt</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the question"
              placeholderTextColor="#888"
              value={q.prompt}
              onChangeText={(v) => updateQuestionField(qIdx, 'prompt', v)}
            />
          </View>

          <Text style={styles.label}>Choices</Text>
          {q.choices.map((choice, cIdx) => (
            <View key={cIdx} style={styles.choiceRow}>
              <TextInput
                style={[styles.input, styles.choiceInput]}
                placeholder={`Choice ${cIdx + 1}`}
                placeholderTextColor="#888"
                value={choice}
                onChangeText={(v) => updateChoice(qIdx, cIdx, v)}
              />
              <Pressable
                style={[
                  styles.smallButton,
                  q.choices.length <= MIN_CHOICES && styles.smallButtonDisabled,
                ]}
                onPress={() => removeChoice(qIdx, cIdx)}
                disabled={q.choices.length <= MIN_CHOICES}
              >
                <Text
                  style={[
                    styles.smallButtonText,
                    q.choices.length <= MIN_CHOICES && styles.smallButtonTextDisabled,
                  ]}
                >
                  Remove
                </Text>
              </Pressable>
            </View>
          ))}

          <View style={styles.questionActions}>
            <Pressable
              style={[
                styles.smallButton,
                q.choices.length >= MAX_CHOICES && styles.smallButtonDisabled,
              ]}
              onPress={() => addChoice(qIdx)}
              disabled={q.choices.length >= MAX_CHOICES}
            >
              <Text
                style={[
                  styles.smallButtonText,
                  q.choices.length >= MAX_CHOICES && styles.smallButtonTextDisabled,
                ]}
              >
                + Add Choice
              </Text>
            </Pressable>
            <Text style={styles.choiceCount}>
              {q.choices.length}/{MAX_CHOICES}
            </Text>
            <Pressable
              style={[
                styles.smallButton,
                styles.removeQuestionBtn,
                questions.length <= 1 && styles.smallButtonDisabled,
              ]}
              onPress={() => removeQuestion(qIdx)}
              disabled={questions.length <= 1}
            >
              <Text
                style={[
                  styles.smallButtonText,
                  questions.length <= 1 && styles.smallButtonTextDisabled,
                ]}
              >
                Remove Question
              </Text>
            </Pressable>
          </View>
        </View>
      ))}

      <View style={styles.actions}>
        <Pressable style={styles.secondaryButton} onPress={addQuestion}>
          <Text style={styles.secondaryButtonText}>+ Add Question</Text>
        </Pressable>
        <Pressable
          style={[styles.primaryButton, !isValid() && styles.primaryButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid()}
        >
          <Text style={styles.primaryButtonText}>Save Quiz</Text>
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
    content: { padding: 16, paddingBottom: 32 },
  screenTitle: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 20 },
    field: { marginBottom: 16 },
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
    questionCard: {
      borderWidth: 1,
    borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    backgroundColor: colors.panel,
    },
    questionLegend: {
      fontSize: 16,
      fontWeight: 'bold',
    color: colors.text,
      marginBottom: 12,
    },
    choiceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    choiceInput: { flex: 1 },
    questionActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 12,
      flexWrap: 'wrap',
    },
    choiceCount: { fontSize: 14, color: colors.muted },
    removeQuestionBtn: { marginLeft: 'auto' },
    smallButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.elev,
    },
    smallButtonDisabled: { opacity: 0.5 },
    smallButtonText: { fontSize: 14, color: colors.text },
    smallButtonTextDisabled: { color: colors.muted },
    actions: { flexDirection: 'row', gap: 12, marginTop: 8, flexWrap: 'wrap' },
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    primaryButtonDisabled: { opacity: 0.5 },
    primaryButtonText: { color: colors.bg, fontSize: 16, fontWeight: '600' },
    secondaryButton: {
      backgroundColor: colors.panel,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: { fontSize: 16, color: colors.text },
})
