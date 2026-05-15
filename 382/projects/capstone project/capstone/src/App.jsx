import {useState} from 'react';

const CATEGORIES = ["School", "Work", "Personal", "Health", "Other"];


function App() {
  const [showNewEntry, setShowNewEntry] = useState(true);
  const [category, setCategory] = useState(CATEGORIES[0]);

  return (
      <div>
        <h1>Capstone Starter</h1>
        {showNewEntry && (
        <div>
          <h2>New Entry (Test View)</h2>
          <div>
            <label>
              Category:{" "}
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

<p>Selected category: {category}</p>
        </div>
      )}
      <button onClick={() => setShowNewEntry(!showNewEntry)}>
            {showNewEntry ? "Hide New Entry" : "Show New Entry"}
      </button>
    </div>
  );
}


export default App;