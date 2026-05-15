import { useState, useEffect, useRef } from 'react'

export default function QuizList({ quizzes, onTakeQuiz, onEditQuiz, onDeleteQuiz }) {
  const [openMenuId, setOpenMenuId] = useState(null)
  const menuRefs = useRef({})

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId) {
        const menuRef = menuRefs.current[openMenuId]
        if (menuRef && !menuRef.contains(event.target)) {
          setOpenMenuId(null)
        }
      }
    }

    if (openMenuId) {
      // Use click instead of mousedown to allow button clicks to process first
      document.addEventListener('click', handleClickOutside, true)
      return () => document.removeEventListener('click', handleClickOutside, true)
    }
  }, [openMenuId])

  const toggleMenu = (id, event) => {
    event.stopPropagation()
    setOpenMenuId(openMenuId === id ? null : id)
  }

  const handleEdit = (id, event) => {
    event.preventDefault()
    event.stopPropagation()
    setOpenMenuId(null)
    if (onEditQuiz) {
      onEditQuiz(id)
    }
  }

  const handleDelete = (id, title, event) => {
    event.preventDefault()
    event.stopPropagation()
    setOpenMenuId(null)
    if (onDeleteQuiz) {
      if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
        onDeleteQuiz(id)
      }
    }
  }

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Available Quizzes</h2>
        <span className="muted">
          {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''}
        </span>
      </div>

      {quizzes.length === 0 ? (
        <div className="empty-state">
          <p>No quizzes yet. Create one!</p>
        </div>
      ) : (
        <div className="grid">
          {quizzes.map((q) => (
            <article key={q.id} className="card" style={{ position: 'relative' }}>
              {/* Menu button at top */}
              <div
                ref={(el) => (menuRefs.current[q.id] = el)}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 10,
                }}
              >
                <button
                  onClick={(e) => toggleMenu(q.id, e)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--panel)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    lineHeight: 1,
                    padding: 0,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--elev)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--panel)'
                  }}
                >
                  ⋯
                </button>

                {/* Dropdown menu */}
                {openMenuId === q.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 36,
                      right: 0,
                      backgroundColor: 'var(--panel)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      minWidth: 120,
                      overflow: 'hidden',
                    }}
                  >
                    {onEditQuiz && (
                      <button
                        onClick={(e) => handleEdit(q.id, e)}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          textAlign: 'left',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: 'var(--text)',
                          cursor: 'pointer',
                          fontSize: 14,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--elev)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {onDeleteQuiz && (
                      <button
                        onClick={(e) => handleDelete(q.id, q.title, e)}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          textAlign: 'left',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: 14,
                          borderTop: '1px solid var(--border)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--elev)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail only */}
              <div
                className="thumb"
                style={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  background: '#f3f4f6', // neutral gray
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {q.thumbnail ? (
                  <img
                    src={q.thumbnail}
                    alt={`${q.title || 'Quiz'} thumbnail`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    loading="lazy"
                  />
                ) : (
                  <span className="muted" style={{ fontSize: 14 }}>
                    No image
                  </span>
                )}
              </div>

              <div className="card-body">
                <h3 className="card-title" title={q.title}>
                  {q.title}
                </h3>
                <p className="card-meta">
                  {q.questions.length} question{q.questions.length !== 1 ? 's' : ''}
                </p>
                <div className="card-actions" style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-primary" onClick={() => onTakeQuiz(q.id)}>
                    Take Quiz
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

