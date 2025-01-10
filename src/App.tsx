import { useState } from 'react'
import './App.css'
import InputBox from './input/InputBox'
import Schedule from './render/Schedule'
import Classes from './render/Classes'
import ImageRenderer from './output/ImageRenderer'
import { parse_sis } from './process/parse'
import { arrange } from './process/arrange'
import { sample_text } from './input/sampleinput'

function App() {
  const [text, setText] = useState(sample_text)

  const parsed = parse_sis(text)
  console.log(parsed)
  const { classes, schedule } = arrange(parsed)

  return (
    <>
      <h1>SchedBuilder</h1>
      <div>
        <h2>Input</h2>
        <InputBox text={text} setText={setText} />
      </div>
      <div>
        <h2>Rendering</h2>
        <div id="render-source" className="render-container">
          <h1>Schedule</h1>
          <Schedule {...schedule} />
          <Classes classes={classes} />
        </div>
      </div>
      <div>
        <h2>Image Renderer</h2>
        <ImageRenderer for="render-source" />
      </div>
    </>
  )
}

export default App
