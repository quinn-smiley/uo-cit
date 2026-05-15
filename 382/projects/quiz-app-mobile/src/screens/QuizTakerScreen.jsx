/**
 * React Native version of Quiz Taker.
 * Use in an Expo app: pass quiz and onBack via route.params or context.
 *
 * Dependencies: react-native (View, Text, ScrollView, Pressable, Image, StyleSheet)
 */
import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native'
import { colors } from '../theme/colors'
import { useResponsive } from '../theme/layout'

export default function QuizTakerScreen({ quiz, onBack }) {
  const { isSmall, width } = useResponsive()
  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null))
  const [submitted, setSubmitted] = useState(false)

  const setAnswer = (qIdx, cIdx) => {
    setAnswers(prev => prev.map((a, i) => (i === qIdx ? cIdx : a)))
  }

  const calculateResult = () => {
    if (!quiz.results || quiz.results.length === 0) return null

    const resultScores = quiz.results.map(result => {
      if (result.scoring !== undefined) {
        let totalScore = 0
        answers.forEach((choiceIndex, questionIndex) => {
          if (choiceIndex !== null) {
            const key = `q${questionIndex}c${choiceIndex}`
            totalScore += result.scoring?.[key] || 0
          }
        })
        return { result, score: totalScore }
      }

      let conditionSets = result.conditionSets
      if (!conditionSets && result.conditions) {
        conditionSets = [result.conditions]
      }
      if (!conditionSets || conditionSets.length === 0) {
        return { result, score: 0 }
      }

      const anySetMatches = conditionSets.some(conditionSet =>
        conditionSet.every(
          condition => answers[condition.questionIndex] === condition.choiceIndex
        )
      )
      return { result, score: anySetMatches ? 1000 : 0 }
    })

    const sorted = resultScores.sort((a, b) => b.score - a.score)
    const winner = sorted[0]
    return winner && winner.score > 0 ? winner.result : null
  }

  const handleSubmit = () => setSubmitted(true)
  const matchedResult = submitted ? calculateResult() : null
  const allAnswered = !answers.includes(null)

  if (!submitted) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{quiz.title}</Text>

        {quiz.questions.map((q, qIdx) => (
          <View key={qIdx} style={styles.questionCard}>
            <Text style={styles.questionPrompt}>
              Q{qIdx + 1}: {q.prompt}
            </Text>
            <View style={styles.choices}>
              {q.choices.map((choice, cIdx) => {
                const isSelected = answers[qIdx] === cIdx
                return (
                  <Pressable
                    key={cIdx}
                    onPress={() => setAnswer(qIdx, cIdx)}
                    style={[
                      styles.choiceRow,
                      isSelected && styles.choiceRowSelected,
                    ]}
                  >
                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.choiceText}>{choice}</Text>
                  </Pressable>
                )
              })}
            </View>
          </View>
        ))}

        <View style={styles.actions}>
          <Pressable style={styles.btnSecondary} onPress={onBack}>
            <Text style={styles.btnSecondaryText}>Back</Text>
          </Pressable>
          <Pressable
            style={[styles.btnPrimary, !allAnswered && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={!allAnswered}
          >
            <Text style={styles.btnPrimaryText}>Submit</Text>
          </Pressable>
        </View>
      </ScrollView>
    )
  }

  // Results view
  const resultImageWidth = Math.min(isSmall ? width - 32 : 240, 320)
  const resultImageHeight = Math.round((resultImageWidth * 3) / 4)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.resultsHeading}>Your Results</Text>

      {matchedResult ? (
        <View
          style={[
            styles.resultCard,
            isSmall ? styles.resultCardStack : styles.resultCardRow,
          ]}
        >
          {matchedResult.image && (
            <Image
              source={{ uri: matchedResult.image }}
              style={[
                styles.resultImage,
                { width: resultImageWidth, height: resultImageHeight },
              ]}
              resizeMode="cover"
              accessible
              accessibilityLabel={matchedResult.title || 'Result image'}
            />
          )}
          <View style={styles.resultBody}>
            <Text style={styles.resultTitle}>
              {matchedResult.title || 'Your Result'}
            </Text>
            {matchedResult.description ? (
              <Text style={styles.resultDescription}>
                {matchedResult.description}
              </Text>
            ) : null}
          </View>
        </View>
      ) : quiz.results?.length > 0 ? (
        <View style={styles.noMatchCard}>
          <Text style={styles.noMatchText}>
            No specific result matched your answers.
          </Text>
        </View>
      ) : null}

      <View style={styles.doneWrapper}>
        <Pressable style={styles.btnPrimary} onPress={onBack}>
          <Text style={styles.btnPrimaryText}>Done</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
    },
    questionCard: {
      backgroundColor: colors.panel,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 16,
    },
    questionPrompt: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    choices: {
      gap: 8,
    },
    choiceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      gap: 12,
      borderRadius: 8,
      backgroundColor: colors.elev,
    },
    choiceRowSelected: {
      backgroundColor: colors.primaryBg,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.muted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOuterSelected: {
      borderColor: colors.primary,
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    choiceText: {
      fontSize: 15,
      color: colors.text,
      flex: 1,
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    btnPrimary: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 8,
      minWidth: 120,
      alignItems: 'center',
    },
    btnPrimaryText: {
      color: colors.bg,
      fontSize: 16,
      fontWeight: '600',
    },
    btnSecondary: {
      backgroundColor: colors.panel,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    btnSecondaryText: {
      color: colors.text,
      fontSize: 16,
    },
    btnDisabled: {
      opacity: 0.5,
    },
    resultsHeading: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    resultCard: {
      backgroundColor: colors.panel,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 24,
      marginBottom: 20,
      alignItems: 'flex-start',
    },
    resultCardRow: {
      flexDirection: 'row',
      gap: 24,
    },
    resultCardStack: {
      flexDirection: 'column',
      gap: 16,
    },
    resultImage: {
      borderRadius: 8,
      backgroundColor: colors.elev,
    },
    resultBody: {
      flex: 1,
    },
    resultTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    resultDescription: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.text,
    },
    noMatchCard: {
      backgroundColor: colors.panel,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 20,
      marginBottom: 20,
    },
    noMatchText: {
      fontSize: 16,
      color: colors.muted,
    },
    doneWrapper: {
      alignItems: 'center',
      marginTop: 24,
    },
})
