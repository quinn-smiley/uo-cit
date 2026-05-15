import { useState } from 'react'

export default function QuizBuilder({ onSave, onCancel, initialQuiz = null }) {
  const MIN_CHOICES = 2
  const MAX_CHOICES = 5

  const emptyQuestion = () => ({ prompt: '', choices: ['', '', ''] }) // start with 3 choices
  const [title, setTitle] = useState(() => initialQuiz?.title || '')
  const [questions, setQuestions] = useState(() => 
    initialQuiz?.questions && initialQuiz.questions.length > 0
      ? initialQuiz.questions.map(q => ({
          prompt: q.prompt || '',
          choices: q.choices && q.choices.length > 0 ? q.choices : ['', '', '']
        }))
      : [emptyQuestion()]
  )

  const updateQuestionField = (idx, field, value) => {
    setQuestions(prev => prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q)))
  }

  const updateChoice = (qIdx, cIdx, value) => {
    setQuestions(prev =>
      prev.map((q, i) => {
        if (i !== qIdx) return q
        const choices = q.choices.slice()
        choices[cIdx] = value
        return { ...q, choices }
      })
    )
  }

  const addChoice = (qIdx) => {
    setQuestions(prev =>
      prev.map((q, i) => {
        if (i !== qIdx) return q
        if (q.choices.length >= MAX_CHOICES) return q // safeguard
        return { ...q, choices: [...q.choices, ''] }
      })
    )
  }

  const removeChoice = (qIdx, cIdx) => {
    setQuestions(prev =>
      prev.map((q, i) => {
        if (i !== qIdx) return q
        // prevent removing below minimum
        if (q.choices.length <= MIN_CHOICES) return q
        const next = q.choices.filter((_, idx) => idx !== cIdx)
        return { ...q, choices: next }
      })
    )
  }

  const addQuestion = () => setQuestions(prev => [...prev, emptyQuestion()])

  const removeQuestion = (idx) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx))
  }

  const isValid = () => {
    if (!title.trim()) return false
    if (questions.length === 0) return false
    return questions.every(q =>
      q.prompt.trim() &&
      q.choices.length >= MIN_CHOICES &&
      q.choices.length <= MAX_CHOICES &&
      q.choices.every(c => c.trim())
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid()) return
    const cleaned = {
      title: title.trim(),
      questions: questions.map(q => ({
        prompt: q.prompt.trim(),
        choices: q.choices.map(c => c.trim())
      }))
    }
    onSave(cleaned)
  }

  return (
    <section>
      <h2>{initialQuiz ? 'Edit Quiz' : 'Create a Quiz'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
        <label>
          Title
          <input
            type="text"
            placeholder="e.g., Icebreaker Questions"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <div style={{ display: 'grid', gap: 16 }}>
          {questions.map((q, qIdx) => (
            <fieldset key={qIdx} style={{ border: '1px solid #ccc', padding: 12 }}>
              <legend>Question {qIdx + 1}</legend>

              <label>
                Prompt
                <input
                  type="text"
                  placeholder="Enter the question"
                  value={q.prompt}
                  onChange={(e) => updateQuestionField(qIdx, 'prompt', e.target.value)}
                />
              </label>

              <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                {q.choices.map((choice, cIdx) => {
                  const canRemove = q.choices.length > MIN_CHOICES
                  return (
                    <div key={cIdx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <label style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                        <span>Choice {cIdx + 1}</span>
                        <input
                          type="text"
                          value={choice}
                          onChange={(e) => updateChoice(qIdx, cIdx, e.target.value)}
                          style={{ flex: 1 }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeChoice(qIdx, cIdx)}
                        disabled={!canRemove}
                        title={canRemove ? 'Remove this choice' : `At least ${MIN_CHOICES} choices required`}
                      >
                        Remove
                      </button>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => addChoice(qIdx)}
                  disabled={q.choices.length >= MAX_CHOICES}
                  title={q.choices.length >= MAX_CHOICES ? `Max ${MAX_CHOICES} choices reached` : 'Add another choice'}
                >
                  + Add Choice
                </button>
                <span style={{ color: '#666', fontSize: 12 }}>
                  {q.choices.length}/{MAX_CHOICES} choices
                </span>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIdx)}
                  disabled={questions.length === 1}
                  style={{ marginLeft: 'auto' }}
                >
                  Remove Question
                </button>
              </div>
            </fieldset>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={addQuestion}>+ Add Question</button>
          <button type="submit" disabled={!isValid()}>Save Quiz</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </section>
  )
}

