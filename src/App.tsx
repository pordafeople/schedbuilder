import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Subject from './Subject'
import InputBox from './InputBox'
import Schedule from './render/Schedule'
import { sample_table } from './render/sampleinput'

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('<Loading sample text...>')
  useEffect(() => {
    fetch('../ignore/input.txt')
      .then((res) => res.text())
      .then((value) => setText(value))
      .catch((_e) => setText('<Failed to load sample text.>'))
  }, [])

  return (
    <>
      <div>
        <Subject />
        <InputBox text={text} setText={setText} />
        <Schedule {...sample_table} />
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
