import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import InputBox from './input/InputBox'
import Schedule from './render/Schedule'
import Classes from './render/Classes'
import ImageRenderer from './output/ImageRenderer'
import { parse_sis } from './process/parse'
import { arrange } from './process/arrange'
import { sample_text } from './input/sampleinput'

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState(sample_text)

  const parsed = parse_sis(text)
  console.log(parsed)
  const { classes, schedule } = arrange(parsed)

  return (
    <>
      <div>
        <h1>SchedBuilder</h1>
        <InputBox text={text} setText={setText} />
        <br />
        <ImageRenderer for="render-source" />
        <br />
        <div id="render-source" className="render-container">
          <Schedule {...schedule} />
          <Classes classes={classes} />
        </div>
      </div>
      <div>
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
