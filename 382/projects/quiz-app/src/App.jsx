// App.jsx
import "./style.css";
import { useEffect, useState } from "react";
import QuizList from "./components/QuizList";
import QuizTaker from "./components/QuizTaker";
import QuizBuilder from "./components/QuizBuilder";
import QuizCreationWizard from "./components/QuizCreationWizard";
import { loadQuizzes, saveQuizzes } from "./utils/storage.js";

export default function App() {
  const [view, setView] = useState("list"); // 'list' | 'build' | 'wizard' | 'take' | 'edit'
  const [quizzes, setQuizzes] = useState(() => {
    const fromStorage = loadQuizzes();
    return fromStorage || [
      {
        id: "1",
        title: "Sample Quiz",
        questions: [{ prompt: "Favorite color?", choices: ["Red", "Blue", "Green"] }],
      },
    ];
  });

  const [activeQuizId, setActiveQuizId] = useState(null);
  const [draftQuiz, setDraftQuiz] = useState(null);
  const [editingQuizId, setEditingQuizId] = useState(null);

  useEffect(() => {
    saveQuizzes(quizzes);
  }, [quizzes]);

  
const handleCreateQuiz = (newQuiz) => {
  console.log('[App] handleCreateQuiz received:', {
    title: newQuiz.title,
    questionsCount: newQuiz.questions?.length || 0,
    hasThumbnail: !!newQuiz.thumbnail,
    resultsCount: newQuiz.results?.length || 0
  })
  
  // Ensure all fields are included
  const completeQuiz = {
    title: newQuiz.title || '',
    questions: newQuiz.questions || [],
    thumbnail: newQuiz.thumbnail || null,
    results: newQuiz.results || []
  }
  
  setQuizzes((prev) => {
    const nextId = prev.length
      ? String(Math.max(...prev.map((q) => Number(q.id) || 0)) + 1)
      : '1'
    const updated = [...prev, { ...completeQuiz, id: nextId }]
    console.log('[App] Updated quizzes array, new length:', updated.length)
    return updated
  })
  setView('list')
}

const handleUpdateQuiz = (updatedQuiz) => {
  console.log('[App] handleUpdateQuiz received:', {
    id: editingQuizId,
    title: updatedQuiz.title,
    questionsCount: updatedQuiz.questions?.length || 0,
    hasThumbnail: !!updatedQuiz.thumbnail,
    resultsCount: updatedQuiz.results?.length || 0
  })
  
  // Ensure all fields are included
  const completeQuiz = {
    title: updatedQuiz.title || '',
    questions: updatedQuiz.questions || [],
    thumbnail: updatedQuiz.thumbnail || null,
    results: updatedQuiz.results || []
  }
  
  setQuizzes((prev) => {
    const updated = prev.map((q) => 
      q.id === editingQuizId ? { ...completeQuiz, id: editingQuizId } : q
    )
    console.log('[App] Updated quiz in array')
    return updated
  })
  setEditingQuizId(null)
  setDraftQuiz(null)
  setView('list')
}

const handleEditQuiz = (id) => {
  const quizToEdit = quizzes.find((q) => q.id === id)
  if (quizToEdit) {
    setEditingQuizId(id)
    setDraftQuiz(quizToEdit)
    setView('wizard')
  }
}

const handleDeleteQuiz = (id) => {
  setQuizzes((prev) => {
    const updated = prev.filter((q) => q.id !== id)
    console.log('[App] Deleted quiz:', id, 'Remaining quizzes:', updated.length)
    return updated
  })
  // If we're viewing the deleted quiz, go back to list
  if (activeQuizId === id) {
    setActiveQuizId(null)
    setView('list')
  }
  // If we're editing the deleted quiz, cancel editing
  if (editingQuizId === id) {
    setEditingQuizId(null)
    setDraftQuiz(null)
    setView('list')
  }
}


  const handleTakeQuiz = (id) => {
    setActiveQuizId(id);
    setView("take");
  };

  const activeQuiz = quizzes.find((q) => q.id === activeQuizId) || null;

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">Quiz App</h1>
        <nav className="nav">
          <button className="btn" onClick={() => setView("list")}>All Quizzes</button>

          {/* If you still want to start directly in builder */}
          <button className="btn" onClick={() => setView("build")}>Create Quiz</button>

          {/* Or start directly in wizard (build inside wizard) */}
          {/* <button className="btn" onClick={() => setView("wizard")}>Create Quiz</button> */}
        </nav>
      </header>

      <main className="section">
        {view === "list" && <QuizList quizzes={quizzes} onTakeQuiz={handleTakeQuiz} onEditQuiz={handleEditQuiz} onDeleteQuiz={handleDeleteQuiz} />}

        {view === "build" && (
          <QuizBuilder
            onCancel={() => setView("list")}
            onSave={(quizFromBuilder) => {
              setDraftQuiz(quizFromBuilder);
              setView("wizard");
            }}
          />
        )}

        {view === "wizard" && (
          <QuizCreationWizard
            initialDraft={draftQuiz}
            isEditing={!!editingQuizId}
            onCancel={() => {
              setDraftQuiz(null);
              setEditingQuizId(null);
              setView("list");
            }}
            onSubmit={editingQuizId ? handleUpdateQuiz : handleCreateQuiz}
          />
        )}

        {view === "take" && activeQuiz && (
          <QuizTaker quiz={activeQuiz} onBack={() => setView("list")} />
        )}
        {view === "take" && !activeQuiz && <p className="muted">No quiz selected.</p>}
      </main>
    </div>
  );
}