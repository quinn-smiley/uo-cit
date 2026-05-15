
import { useState } from 'react'

export default function QuizTaker({ quiz, onBack }) {
  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null))
  const [submitted, setSubmitted] = useState(false)

  const setAnswer = (qIdx, cIdx) => {
    setAnswers(prev => prev.map((a, i) => i === qIdx ? cIdx : a))
  }

  const calculateResult = () => {
    if (!quiz.results || quiz.results.length === 0) {
      return null
    }

    // Calculate scores for each result based on user's answers
    const resultScores = quiz.results.map(result => {
      // Check if this result uses the new scoring system
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

      // Backward compatibility: check old conditionSets format
      let conditionSets = result.conditionSets
      if (!conditionSets && result.conditions) {
        conditionSets = [result.conditions]
      }
      
      if (!conditionSets || conditionSets.length === 0) {
        // Result with no conditions - give it a score of 0 (fallback)
        return { result, score: 0 }
      }

      // Check if ANY condition set matches
      const anySetMatches = conditionSets.some(conditionSet => {
        return conditionSet.every(condition => {
          const userAnswer = answers[condition.questionIndex]
          return userAnswer === condition.choiceIndex
        })
      })

      // If matches, give it a high score; otherwise 0
      return { result, score: anySetMatches ? 1000 : 0 }
    })

    // Find result with highest score
    const sorted = resultScores.sort((a, b) => b.score - a.score)
    const winner = sorted[0]

    // Return the winner if it has a score > 0, otherwise return null
    return winner && winner.score > 0 ? winner.result : null
  }

  const handleSubmit = () => setSubmitted(true)

  const matchedResult = submitted ? calculateResult() : null

  return (
    <section>
      <h2>{quiz.title}</h2>

      {!submitted ? (
        <div style={{ display: 'grid', gap: 16 }}>
          {quiz.questions.map((q, qIdx) => (
            <div key={qIdx} style={{ border: '1px solid #ddd', padding: 12 }}>
              <p><strong>Q{qIdx + 1}:</strong> {q.prompt}</p>
              <div style={{ display: 'grid', gap: 4 }}>
                {q.choices.map((choice, cIdx) => (
                  <label key={cIdx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="radio"
                      name={`q-${qIdx}`}
                      checked={answers[qIdx] === cIdx}
                      onChange={() => setAnswer(qIdx, cIdx)}
                    />
                    {choice}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onBack}>Back</button>
            <button onClick={handleSubmit} disabled={answers.includes(null)}>Submit</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          <h3>Your Results</h3>

          {matchedResult ? (
            <div style={{ 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius)', 
              padding: 24, 
              backgroundColor: 'var(--panel)',
              marginBottom: 20,
              display: 'flex',
              gap: 24,
              alignItems: 'flex-start'
            }}>
              {matchedResult.image && (
                <div style={{ flexShrink: 0, width: 300, height: 225, overflow: 'hidden', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <img
                    src={matchedResult.image}
                    alt={matchedResult.title || 'Result image'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h4 style={{ marginTop: 0, marginBottom: 12, color: 'var(--text)', fontSize: 24, fontWeight: 'bold' }}>{matchedResult.title || 'Your Result'}</h4>
                {matchedResult.description && (
                  <p style={{ marginBottom: 0, fontSize: 17, lineHeight: 1.7, color: 'var(--text)', fontWeight: '500' }}>
                    {matchedResult.description}
                  </p>
                )}
              </div>
            </div>
          ) : quiz.results && quiz.results.length > 0 ? (
            <div style={{ 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius)', 
              padding: 20, 
              backgroundColor: 'var(--panel)',
              marginBottom: 20
            }}>
              <p style={{ margin: 0, fontSize: 16, color: 'var(--muted)', fontWeight: '500' }}>
                No specific result matched your answers.
              </p>
            </div>
          ) : null}

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            <button 
              className="btn btn-primary" 
              onClick={onBack}
              style={{ 
                padding: '14px 32px', 
                fontSize: '16px', 
                fontWeight: '600',
                minWidth: '140px'
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

