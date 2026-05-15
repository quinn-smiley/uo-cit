import { useState, useRef } from 'react'
import QuizBuilder from './QuizBuilder'

export default function QuizCreationWizard({ onCancel, onSubmit, initialDraft = null, isEditing = false }) {
  // Initialize once from initialDraft; no effects needed
  const [draftQuiz, setDraftQuiz] = useState(() => initialDraft ?? null)
  const [thumbnail, setThumbnail] = useState(() => initialDraft?.thumbnail ?? null)
  const [results, setResults] = useState(() => initialDraft?.results ?? [])
  const [step, setStep] = useState(() => {
    if (initialDraft) {
      // If editing, start at build step to allow editing questions
      return 'build'
    }
    return 'build'
  }) // build -> results -> thumbnail -> review

  const handleBuilderSave = (quizFromBuilder) => {
    setDraftQuiz(quizFromBuilder)
    setStep('results')
  }

  const goToThumbnail = () => {
    if (!draftQuiz) return
    setStep('thumbnail')
  }

  const goToReview = () => {
    if (!draftQuiz) return
    setStep('review')
  }

  const handlePost = () => {
    if (!draftQuiz) return
    
    // Ensure all data is included: title, questions, thumbnail, and results
    const finalQuiz = {
      title: draftQuiz.title || '',
      questions: draftQuiz.questions || [],
      thumbnail: thumbnail || null,
      results: results || []
    }
    
    console.log('[Wizard] Posting quiz with all data:', {
      title: finalQuiz.title,
      questionsCount: finalQuiz.questions.length,
      hasThumbnail: !!finalQuiz.thumbnail,
      resultsCount: finalQuiz.results.length,
      thumbnailSize: finalQuiz.thumbnail ? `${(finalQuiz.thumbnail.length / 1024).toFixed(2)} KB` : 'N/A'
    })
    
    onSubmit(finalQuiz)
  }

  const label =
    step === 'build' ? (isEditing ? 'Edit Quiz' : 'Build Quiz') :
    step === 'results' ? 'Configure Results' :
    step === 'thumbnail' ? 'Add Thumbnail (Optional)' :
    (isEditing ? 'Review & Save Changes' : 'Review & Publish')

  return (
    <div className="wizard">
      <div className="wizard-header" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>{label}</h2>
        <p className="muted" style={{ marginTop: 4 }}>Step: {step}</p>
        <hr />
      </div>

      {step === 'build' && (
        <div>
          <div className="muted" style={{ marginBottom: 12 }}>
            {isEditing ? 'Edit your quiz questions and choices.' : 'Build your quiz. Next, configure results based on answers.'}
          </div>
          <QuizBuilder 
            onCancel={onCancel} 
            onSave={handleBuilderSave}
            initialQuiz={initialDraft}
          />
        </div>
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
    </div>
  )
}

function ThumbnailStep({ thumbnail, onChange, onBack, onNext, onCancel, isEditing = false }) {
  const [error, setError] = useState(null)

  const handleFile = (file) => {
    setError(null)
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    try {
      const reader = new FileReader()
      reader.onload = () => onChange(reader.result) // Data URL for persistence/preview
      reader.onerror = () => setError('Failed to read the image file.')
      reader.readAsDataURL(file)
    } catch {
      setError('Could not process the image.')
    }
  }

  return (
    <div>
      <p>Upload an optional thumbnail to display on the list page.</p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {error && <div style={{ color: '#b00020', marginTop: 8 }}>{error}</div>}

      {thumbnail && (
        <div className="card" style={{ padding: 12, marginTop: 12, display: 'inline-block' }}>
          <div style={{ width: 240, height: 140, overflow: 'hidden', borderRadius: 8 }}>
            <img
              src={thumbnail}
              alt="Quiz thumbnail preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-secondary" onClick={() => onChange(null)}>Remove</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn" onClick={onNext}>{isEditing ? 'Continue to Review' : 'Continue to Review'}</button>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

function ResultsStep({ quiz, results, onChange, onBack, onNext, onCancel }) {
  // Use ref to track ID counter (avoids linter issues with impure functions)
  const idCounterRef = useRef(0)
  
  // Normalize old formats for backward compatibility
  const normalizeResult = (result) => {
    // If it has scoring, it's already in the new format
    if (result.scoring !== undefined) return result
    
    // Migrate from old conditionSets format
    if (result.conditionSets) {
      return { ...result, scoring: {} }
    }
    
    // Migrate from old conditions format
    if (result.conditions) {
      return { ...result, scoring: {} }
    }
    
    return { ...result, scoring: {} }
  }

  const normalizedResults = results.map(normalizeResult)

  const addResult = () => {
    idCounterRef.current += 1
    const newResult = {
      id: `result-${idCounterRef.current}-${normalizedResults.length}`,
      title: '',
      description: '',
      scoring: {} // { "q0c0": 1, "q0c1": 2, ... } - points awarded when user selects this choice
    }
    onChange([...normalizedResults, newResult])
  }

  const removeResult = (resultId) => {
    onChange(normalizedResults.filter(r => r.id !== resultId))
  }

  const updateResult = (resultId, field, value) => {
    onChange(normalizedResults.map(r => r.id === resultId ? { ...r, [field]: value } : r))
  }

  const handleImageUpload = (resultId, file) => {
    if (!file) {
      updateResult(resultId, 'image', null)
      return
    }
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }
    
    try {
      const reader = new FileReader()
      reader.onload = () => {
        updateResult(resultId, 'image', reader.result) // Data URL
      }
      reader.onerror = () => {
        alert('Failed to read the image file.')
      }
      reader.readAsDataURL(file)
    } catch {
      alert('Could not process the image.')
    }
  }

  // Map intensity levels to numeric scores
  const intensityToScore = {
    'low': 2,
    'medium': 5,
    'high': 8
  }

  const scoreToIntensity = (score) => {
    if (score >= 7) return 'high'
    if (score >= 4) return 'medium'
    if (score >= 1) return 'low'
    return null
  }

  // Update contribution: checkbox + intensity
  const updateContribution = (resultId, qIdx, cIdx, contributes, intensity) => {
    onChange(normalizedResults.map(r => {
      if (r.id !== resultId) return r
      const scoring = { ...(r.scoring || {}) }
      const key = `q${qIdx}c${cIdx}`
      
      if (contributes && intensity) {
        scoring[key] = intensityToScore[intensity]
      } else {
        delete scoring[key]
      }
      
      return { ...r, scoring }
    }))
  }

  const getScore = (result, qIdx, cIdx) => {
    const key = `q${qIdx}c${cIdx}`
    return result.scoring?.[key] || 0
  }

  const getContribution = (result, qIdx, cIdx) => {
    const score = getScore(result, qIdx, cIdx)
    const contributes = score > 0
    const intensity = scoreToIntensity(score)
    return { contributes, intensity: intensity || 'low' }
  }

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Configure Results</h3>
      <p className="muted" style={{ marginBottom: 16 }}>
        Check which answer choices contribute to each result and set their intensity. The result with the highest total contribution will be shown. This makes it easy to have multiple answer combinations lead to the same result!
      </p>

      {results.length === 0 && (
        <div className="muted" style={{ marginBottom: 16, padding: 12, border: '1px dashed #ccc', borderRadius: 4 }}>
          No results configured. Add at least one result to show personalized outcomes.
        </div>
      )}

      <div style={{ display: 'grid', gap: 16, marginBottom: 16 }}>
        {normalizedResults.map((result, rIdx) => (
          <fieldset key={result.id} style={{ border: '1px solid var(--border)', padding: 24, borderRadius: 'var(--radius)', backgroundColor: 'var(--panel)' }}>
            <legend style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: 18, padding: '0 12px', backgroundColor: 'var(--panel)' }}>Result {rIdx + 1}</legend>

            <label style={{ display: 'block', marginBottom: 12 }}>
              <div style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: 14, marginBottom: 6 }}>Result Title</div>
              <input
                type="text"
                placeholder="e.g., Type A Personality"
                value={result.title}
                onChange={(e) => updateResult(result.id, 'title', e.target.value)}
                style={{ width: '100%', padding: 10, marginTop: 4, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 15, backgroundColor: 'var(--elev)', color: 'var(--text)' }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: 12 }}>
              <div style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: 14, marginBottom: 6 }}>Description</div>
              <textarea
                placeholder="Describe what this result means..."
                value={result.description}
                onChange={(e) => updateResult(result.id, 'description', e.target.value)}
                style={{ width: '100%', padding: 10, marginTop: 4, minHeight: 80, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 14, backgroundColor: 'var(--elev)', color: 'var(--text)', fontFamily: 'inherit' }}
              />
            </label>

            <div style={{ marginTop: 20, marginBottom: 20, padding: 16, backgroundColor: 'var(--elev)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <label style={{ display: 'block', marginBottom: 10 }}>
                <div style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: 14, marginBottom: 6 }}>Result Image (Optional)</div>
                <p style={{ fontSize: 13, marginTop: 4, marginBottom: 8, color: 'var(--muted)' }}>
                  Upload an image to display with this result when users get it.
                </p>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(result.id, e.target.files?.[0] ?? null)}
                style={{ marginTop: 8, padding: 8, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--panel)', cursor: 'pointer', color: 'var(--text)' }}
              />
              {result.image && (
                <div style={{ marginTop: 16, display: 'inline-block' }}>
                  <div style={{ width: 220, height: 165, overflow: 'hidden', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <img
                      src={result.image}
                      alt="Result preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => updateResult(result.id, 'image', null)}
                      style={{ fontSize: 13, padding: '6px 12px' }}
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 20, marginBottom: 12 }}>
              <div style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Configure Answer Contributions</div>
              <p style={{ fontSize: 13, marginTop: 4, color: 'var(--muted)', lineHeight: 1.5 }}>
                For each question, indicate which choices contribute to this result and how strongly. The result with the highest total contribution will be shown.
              </p>
            </div>

            <div style={{ display: 'grid', gap: 14, marginBottom: 16 }}>
              {quiz.questions.map((question, qIdx) => (
                <div key={qIdx} style={{ border: '1px solid var(--border)', padding: 18, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--elev)' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 14, fontSize: 16, color: 'var(--text)' }}>
                    Q{qIdx + 1}: {question.prompt}
                  </div>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {question.choices.map((choice, cIdx) => {
                      const { contributes, intensity } = getContribution(result, qIdx, cIdx)
                      return (
                        <div key={cIdx} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 14, backgroundColor: 'var(--panel)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                          <label style={{ flex: 1, fontSize: 15, color: 'var(--text)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <input
                              type="checkbox"
                              checked={contributes}
                              onChange={(e) => {
                                const newContributes = e.target.checked
                                updateContribution(result.id, qIdx, cIdx, newContributes, newContributes ? intensity : null)
                              }}
                              style={{ width: 18, height: 18, cursor: 'pointer' }}
                            />
                            <span>{choice}</span>
                          </label>
                          {contributes && (
                            <label style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 140 }}>
                              <span style={{ fontSize: 14, color: 'var(--text)', fontWeight: '700' }}>Intensity:</span>
                              <select
                                value={intensity}
                                onChange={(e) => updateContribution(result.id, qIdx, cIdx, true, e.target.value)}
                                style={{
                                  padding: '8px 12px',
                                  border: '1px solid var(--border)',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: 14,
                                  color: 'var(--text)',
                                  backgroundColor: 'var(--elev)',
                                  cursor: 'pointer',
                                  minWidth: 100
                                }}
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </label>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => removeResult(result.id)}
                style={{ marginLeft: 'auto' }}
              >
                Remove Result
              </button>
            </div>
          </fieldset>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className="btn" onClick={addResult}>
          + Add Result
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn" onClick={onNext}>Continue to Thumbnail</button>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

function ReviewStep({ quiz, onBack, onPost, onCancel, isEditing = false }) {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Final Review</h3>

      {quiz.thumbnail ? (
        <div style={{ width: 320, height: 180, marginBottom: 12, overflow: 'hidden', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <img
            src={quiz.thumbnail}
            alt="Quiz thumbnail"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      ) : (
        <div className="muted" style={{ marginBottom: 12 }}>No thumbnail added.</div>
      )}

      <p><strong>Title:</strong> {quiz.title || <em>(untitled)</em>}</p>
      <p><strong>Questions:</strong> {quiz?.questions?.length ?? 0}</p>
      <p><strong>Results:</strong> {quiz?.results?.length ?? 0}</p>

      <ol>
        {(quiz.questions || []).map((q, idx) => (
          <li key={idx} style={{ marginBottom: 8 }}>
            <div><strong>Q{idx + 1}:</strong> {q.prompt || <em>(no prompt)</em>}</div>
            <ul>{(q.choices || []).map((c, i) => <li key={i}>{c}</li>)}</ul>
          </li>
        ))}
      </ol>

      {quiz.results && quiz.results.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h4>Results:</h4>
          <ul>
            {quiz.results.map((result, idx) => {
              // Check if using new scoring system
              const hasScoring = result.scoring !== undefined
              const hasOldFormat = result.conditionSets || result.conditions
              
              return (
                <li key={result.id || idx} style={{ marginBottom: 16, padding: 12, backgroundColor: 'var(--panel)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <strong style={{ color: 'var(--text)' }}>{result.title || `Result ${idx + 1}`}</strong>
                  {result.image && (
                    <div style={{ width: 200, height: 150, marginTop: 8, marginBottom: 8, overflow: 'hidden', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <img
                        src={result.image}
                        alt={result.title || `Result ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  )}
                  {result.description && <div className="muted" style={{ marginTop: 4 }}>{result.description}</div>}
                  
                  {hasScoring && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4, color: 'var(--text)' }}>Scoring System:</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        Points are assigned to answer choices. The result with the highest total score wins.
                      </div>
                      {Object.keys(result.scoring || {}).length === 0 && (
                        <div className="muted" style={{ fontSize: 12, fontStyle: 'italic', marginTop: 4 }}>
                          No points assigned yet.
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!hasScoring && hasOldFormat && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4, color: 'var(--text)' }}>Condition Sets (Legacy):</div>
                      {(() => {
                        let conditionSets = result.conditionSets
                        if (!conditionSets && result.conditions) {
                          conditionSets = [result.conditions]
                        }
                        return conditionSets && conditionSets.length > 0 ? (
                          conditionSets.map((conditionSet, setIdx) => (
                            <div key={setIdx} style={{ marginLeft: 12, marginBottom: 8, padding: 8, backgroundColor: 'var(--elev)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                              <div style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 4, color: 'var(--muted)' }}>
                                Set {setIdx + 1} {conditionSets.length > 1 && '(OR)'}
                              </div>
                              {conditionSet.length > 0 ? (
                                <div className="muted" style={{ fontSize: 12 }}>
                                  {conditionSet.map((c, i) => (
                                    <span key={i}>
                                      Q{c.questionIndex + 1} = {quiz.questions[c.questionIndex]?.choices[c.choiceIndex]}
                                      {i < conditionSet.length - 1 ? ' AND ' : ''}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <div className="muted" style={{ fontSize: 12, fontStyle: 'italic' }}>No conditions (always matches)</div>
                              )}
                            </div>
                          ))
                        ) : null
                      })()}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button className="btn" onClick={onPost}>{isEditing ? 'Save Changes' : 'Publish Quiz'}</button>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

