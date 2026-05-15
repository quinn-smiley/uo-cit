import {useEffect, useState} from 'react';

function App() {
  const [count, setCount] = useState()


  useEffect(() => {
    console.log("Effect ran. Count is:", count);
  });

  return (
    <div>
      <h1>Effect Demo</h1>
      <p>Count: {count}</p>
      <button onClick = {() => setCount(count + 1)}>
        Increment
      </button>
    </div>

  )
}

export default App
